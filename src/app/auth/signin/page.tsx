'use client';

import { useState, useMemo } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { validatePassword } from '@/lib/password-validation';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const router = useRouter();

  // Real-time password validation for help
  const passwordValidation = useMemo(() => {
    return validatePassword(password);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        rememberMe: rememberMe.toString(),
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes('Too many login attempts')) {
          toast.error(result.error);
        } else if (result.error.includes('Account is locked') || result.error.includes('Account is now locked')) {
          toast.error(result.error);
        } else {
          toast.error('Invalid credentials. Please try again.');
        }
      } else {
        toast.success('Successfully signed in!');
        router.push('/');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      toast.error('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isLoading ? 'cursor-not-allowed' : ''}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-3 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Sign in to your account
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="relative bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20"></div>
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 p-[1px]">
              <div className="h-full w-full rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-xl"></div>
        </div>

            <CardHeader className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Enter your credentials to access your account
            </CardDescription>
              </motion.div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Label htmlFor="email" className="text-foreground">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                <Input
                  id="password"
                    type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                    className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Remember Me Section */}
              <motion.div 
                className="flex items-center justify-center py-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <div className="flex items-center space-x-3">
                  {/* Custom Checkbox Switch */}
                  <motion.button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      rememberMe 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500' 
                        : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Toggle Circle */}
                    <motion.div
                      className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                        rememberMe ? 'right-0.5' : 'left-0.5'
                      }`}
                      animate={{
                        x: rememberMe ? 0 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                    
                    {/* Glow effect when active */}
                    {rememberMe && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.button>
                  
                  <Label 
                    htmlFor="remember-me" 
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>
              </motion.div>

              {/* Links Section */}
              <motion.div 
                className="flex items-center justify-center space-x-6 py-0.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.85 }}
              >
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
                <span className="text-muted-foreground">•</span>
                <button
                  type="button"
                  onClick={() => setShowPasswordHelp(!showPasswordHelp)}
                  className="text-sm text-primary hover:text-primary/80 cursor-pointer transition-colors hover:underline"
                >
                  Password help
                </button>
              </motion.div>

              <motion.div
                className="pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-400" />
                      <span className="text-red-400">Signing in...</span>
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </motion.div>

              {/* Create Account Link */}
              <motion.div
                className="text-center pt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors hover:underline"
                >
                  Create a New Account
                </Link>
              </motion.div>
            </form>

            {/* Password Help Section */}
            <AnimatePresence>
              {showPasswordHelp && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 relative bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg p-4"
                >
                  {/* Close Button */}
                  <motion.button
                    onClick={() => setShowPasswordHelp(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 dark:hover:bg-black/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </motion.button>
                  
                  <h4 className="text-sm font-medium text-foreground mb-3 pr-6">Password Requirements</h4>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Your password must contain:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        One uppercase letter (A-Z)
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        One lowercase letter (a-z)
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        One number (0-9)
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        One special character (!@#$%^&*)
                      </li>
                    </ul>
                    <p className="mt-2 text-xs">
                      If you're having trouble, try resetting your password or contact support.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 }}
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.1 }}
            >
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-black/30 hover:border-blue-400/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-400" />
                    <span className="text-red-400">Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Back to Home Link - Under Card */}
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </motion.div>

      </motion.div>
      </div>
    </div>
  );
}

