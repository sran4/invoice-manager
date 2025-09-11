import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  fax?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
  },
  fax: {
    type: String,
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
      default: 'USA',
    },
  },
}, {
  timestamps: true,
});

// Index for efficient queries
CustomerSchema.index({ userId: 1, email: 1 });

// Clear the model from cache to ensure fresh schema
if (mongoose.models.Customer) {
  delete mongoose.models.Customer;
}

export default mongoose.model<ICustomer>('Customer', CustomerSchema);

