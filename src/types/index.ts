// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer Types
export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  fax?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Work Description Types
export interface WorkDescription {
  id: string;
  userId: string;
  category: string;
  description: string;
  rate?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Item Types
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Invoice Types
export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: number;
  customerId: string;
  customer: Customer;
  companyInfo: {
    name: string;
    email: string;
    phone?: string;
    fax?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country?: string;
    };
    logo?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  templateId: string;
  theme: 'blue-purple' | 'green-teal';
  createdAt: Date;
  updatedAt: Date;
}

// Template Types
export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  component: string;
}

// Form Types
export interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  fax?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface WorkDescriptionFormData {
  category: string;
  description: string;
  rate?: number;
}

export interface InvoiceFormData {
  customerId: string;
  items: InvoiceItem[];
  taxRate: number;
  discountRate: number;
  issueDate: string;
  dueDate: string;
  notes?: string;
  templateId: string;
  theme: 'blue-purple' | 'green-teal';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Theme Types
export type Theme = 'blue-purple' | 'green-teal';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

