import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanySettings {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId: string;
  logo?: string;
}

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    browser: boolean;
    invoiceReminders: boolean;
    paymentReminders: boolean;
  };
  invoiceDefaults: {
    dueDays: number;
    taxRate: number;
    currency: string;
    template: string;
  };
}

// New interfaces for security features
export interface ILoginAttempt {
  ip: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
}

export interface IRefreshToken {
  token: string;
  expiresAt: Date;
  deviceInfo: {
    userAgent: string;
    ip: string;
  };
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  image?: string;
  companySettings?: ICompanySettings;
  preferences?: IUserPreferences;
  
  // Security features
  loginAttempts: ILoginAttempt[];
  accountLockedUntil?: Date;
  refreshTokens: IRefreshToken[];
  lastLogin?: Date;
  passwordHistory: string[]; // Store last 5 password hashes
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const CompanySettingsSchema = new Schema<ICompanySettings>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'USA',
    },
  },
  taxId: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
}, { _id: false });

const UserPreferencesSchema = new Schema<IUserPreferences>({
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'auto',
  },
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    browser: {
      type: Boolean,
      default: true,
    },
    invoiceReminders: {
      type: Boolean,
      default: true,
    },
    paymentReminders: {
      type: Boolean,
      default: true,
    },
  },
  invoiceDefaults: {
    dueDays: {
      type: Number,
      default: 30,
    },
    taxRate: {
      type: Number,
      default: 8.25,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    template: {
      type: String,
      default: 'modern',
    },
  },
}, { _id: false });

// New schemas for security features
const LoginAttemptSchema = new Schema<ILoginAttempt>({
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  success: { type: Boolean, required: true },
}, { _id: false });

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  deviceInfo: {
    userAgent: { type: String, required: true },
    ip: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false, // Optional for OAuth users
  },
  image: {
    type: String,
  },
  companySettings: {
    type: CompanySettingsSchema,
  },
  preferences: {
    type: UserPreferencesSchema,
    default: () => ({}),
  },
  
  // Security features
  loginAttempts: {
    type: [LoginAttemptSchema],
    default: [],
  },
  accountLockedUntil: {
    type: Date,
  },
  refreshTokens: {
    type: [RefreshTokenSchema],
    default: [],
  },
  lastLogin: {
    type: Date,
  },
  passwordHistory: {
    type: [String],
    default: [],
    maxlength: 5, // Keep only last 5 passwords
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'refreshTokens.token': 1 });
UserSchema.index({ accountLockedUntil: 1 });

// Method to check if account is locked
UserSchema.methods.isAccountLocked = function() {
  return this.accountLockedUntil && this.accountLockedUntil > new Date();
};

// Method to add login attempt
UserSchema.methods.addLoginAttempt = function(ip: string, userAgent: string, success: boolean) {
  console.log(`Adding login attempt for user ${this.email}: success=${success}, ip=${ip}`);
  
  this.loginAttempts.push({
    ip,
    userAgent,
    timestamp: new Date(),
    success,
  });
  
  // Keep only last 10 attempts
  if (this.loginAttempts.length > 10) {
    this.loginAttempts = this.loginAttempts.slice(-10);
  }
  
  // Check for account lockout (5 failed attempts in 15 minutes)
  const recentFailedAttempts = this.loginAttempts.filter(
    (attempt: ILoginAttempt) => 
      !attempt.success && 
      attempt.timestamp > new Date(Date.now() - 15 * 60 * 1000)
  );
  
  console.log(`Recent failed attempts: ${recentFailedAttempts.length}/5`);
  
  if (recentFailedAttempts.length >= 5) {
    this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
    console.log(`Account locked until: ${this.accountLockedUntil}`);
  }
  
  return this.save();
};

// Method to clear failed attempts on successful login
UserSchema.methods.clearFailedAttempts = function() {
  this.loginAttempts = this.loginAttempts.filter((attempt: ILoginAttempt) => attempt.success);
  this.accountLockedUntil = undefined;
  this.lastLogin = new Date();
  return this.save();
};

// Method to add refresh token
UserSchema.methods.addRefreshToken = function(token: string, userAgent: string, ip: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  console.log(`🔑 Adding refresh token for user ${this.email}`);
  console.log(`🔑 Token expires at: ${expiresAt}`);
  console.log(`🔑 Device: ${userAgent} from ${ip}`);
  
  this.refreshTokens.push({
    token,
    expiresAt,
    deviceInfo: { userAgent, ip },
    createdAt: new Date(),
  });
  
  // Keep only last 5 refresh tokens per user
  if (this.refreshTokens.length > 5) {
    console.log(`🔑 Token limit reached, removing oldest token`);
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  console.log(`📊 Total refresh tokens after adding: ${this.refreshTokens.length}`);
  
  return this.save();
};

// Method to remove refresh token
UserSchema.methods.removeRefreshToken = function(token: string) {
  this.refreshTokens = this.refreshTokens.filter((rt: IRefreshToken) => rt.token !== token);
  return this.save();
};

// Method to clean expired refresh tokens
UserSchema.methods.cleanExpiredRefreshTokens = function() {
  this.refreshTokens = this.refreshTokens.filter(
    (rt: IRefreshToken) => rt.expiresAt > new Date()
  );
  return this.save();
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);