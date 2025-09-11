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

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  image?: string;
  companySettings?: ICompanySettings;
  preferences?: IUserPreferences;
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

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
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
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

