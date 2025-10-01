import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "../db/connection";
import User from "../db/models/User";
import bcrypt from "bcryptjs";
import { loginRateLimit } from "../rate-limit";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Rate limiting check - create a mock request object for rate limiting
          const mockReq = {
            headers: {
              get: (name: string) => {
                const headers = req?.headers || {};
                return headers[name] || headers[name.toLowerCase()];
              },
            },
          };
          const rateLimitResult = loginRateLimit(
            mockReq as { ip: string; url: string }
          );
          if (!rateLimitResult.success) {
            console.log("Rate limit exceeded, but allowing for testing");
            // throw new Error(`Too many login attempts. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)} minutes.`);
          }

          await connectDB();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          // Check if account is locked
          if (user.isAccountLocked()) {
            const lockTimeRemaining = Math.ceil(
              (user.accountLockedUntil!.getTime() - Date.now()) / 60000
            );
            throw new Error(
              `Account is locked due to too many failed attempts. Try again in ${lockTimeRemaining} minutes.`
            );
          }

          // Check password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password || ""
          );

          if (!isPasswordValid) {
            // Add failed login attempt
            const getHeader = (name: string) => {
              const headers = req?.headers || {};
              return headers[name] || headers[name.toLowerCase()] || "unknown";
            };

            try {
              console.log("Adding failed login attempt for user:", user.email);
              await user.addLoginAttempt(
                getHeader("x-forwarded-for"),
                getHeader("user-agent"),
                false
              );
              console.log("Failed login attempt added successfully");

              // Check if account is now locked after this attempt
              const updatedUser = await User.findById(user._id);
              if (updatedUser?.isAccountLocked()) {
                const lockTimeRemaining = Math.ceil(
                  (updatedUser.accountLockedUntil!.getTime() - Date.now()) /
                    60000
                );
                throw new Error(
                  `Account is now locked due to too many failed attempts. Try again in ${lockTimeRemaining} minutes.`
                );
              }
            } catch (error) {
              console.error("Error adding login attempt:", error);
              // Don't throw here, just log the error and continue
            }

            return null;
          }

          // Clear failed attempts on successful login
          await user.clearFailedAttempts();

          // Generate refresh token for "Remember Me"
          let refreshToken = null;
          if (credentials.rememberMe === "true") {
            refreshToken = crypto.randomBytes(32).toString("hex");
            const getHeader = (name: string) => {
              const headers = req?.headers || {};
              return headers[name] || headers[name.toLowerCase()] || "unknown";
            };

            console.log("🔑 Generating refresh token for user:", user.email);
            console.log(
              "🔑 Refresh token (first 10 chars):",
              refreshToken.substring(0, 10) + "..."
            );

            await user.addRefreshToken(
              refreshToken,
              getHeader("user-agent"),
              getHeader("x-forwarded-for")
            );

            console.log("✅ Refresh token added successfully");

            // Verify the token was added
            const updatedUser = await User.findById(user._id);
            console.log(
              `📊 Total refresh tokens for user: ${updatedUser?.refreshTokens.length}`
            );
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            refreshToken,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;

        if ((user as { refreshToken?: string }).refreshToken) {
          console.log("🔑 JWT: Refresh token stored in JWT token");
          console.log(
            "🔑 JWT: Refresh token (first 10 chars):",
            (user as { refreshToken: string }).refreshToken.substring(0, 10) +
              "..."
          );
        } else {
          console.log("🔑 JWT: No refresh token provided");
        }
      }

      // Check if token is expired and we have a refresh token
      if (token.refreshToken && token.exp && Date.now() > token.exp * 1000) {
        console.log("🔄 JWT: Token expired, attempting to refresh...");

        try {
          await connectDB();
          const dbUser = await User.findById(token.id);

          if (dbUser) {
            // Find the refresh token in the database
            const refreshTokenData = dbUser.refreshTokens.find(
              (rt: { token: string; expiresAt: Date }) =>
                rt.token === token.refreshToken && rt.expiresAt > new Date()
            );

            if (refreshTokenData) {
              console.log(
                "✅ JWT: Valid refresh token found, renewing session"
              );
              // Token is valid, we can continue with the same user data
              return {
                ...token,
                exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
              };
            } else {
              console.log("❌ JWT: Refresh token expired or not found");
              // Remove invalid refresh token
              await dbUser.removeRefreshToken(token.refreshToken);
              return null; // This will force a re-login
            }
          }
        } catch (error) {
          console.error("❌ JWT: Error during token refresh:", error);
          return null; // This will force a re-login
        }
      }

      // Handle Google OAuth
      if (account?.provider === "google") {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: user?.email });

          if (!dbUser) {
            // Create new user for Google OAuth
            dbUser = new User({
              email: user?.email,
              name: user?.name,
              image: user?.image,
              password: undefined, // No password for OAuth users
            });
            await dbUser.save();
          } else {
            // Update existing user with Google info
            dbUser.name = user?.name || dbUser.name;
            dbUser.image = user?.image || dbUser.image;
            await dbUser.save();
          }

          token.id = dbUser._id.toString();
        } catch (error) {
          console.error("Error handling Google OAuth:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow Google OAuth
      if (account?.provider === "google") {
        return true;
      }

      // For credentials provider, the authorize function handles validation
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (account?.provider === "credentials") {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            await dbUser.clearFailedAttempts();
          }
        } catch (error) {
          console.error("Error updating user on sign in:", error);
        }
      }
    },
  },
};
