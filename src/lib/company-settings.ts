import { ICompanySettings } from '@/lib/db/models/User';

export interface CompanyInfo {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  taxId?: string;
  logo?: string;
}

// Fetch company settings from API
export const fetchCompanySettings = async (): Promise<CompanyInfo | null> => {
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }

    const data = await response.json();
    if (data.success && data.companySettings) {
      return data.companySettings as CompanyInfo;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return null;
  }
};

// Convert company settings to CompanyInfo format
export const convertToCompanyInfo = (companySettings: ICompanySettings): CompanyInfo => {
  return {
    name: companySettings.name,
    email: companySettings.email,
    phone: companySettings.phone,
    website: companySettings.website,
    address: {
      street: companySettings.address.street,
      city: companySettings.address.city,
      state: companySettings.address.state,
      zipCode: companySettings.address.zipCode,
      country: companySettings.address.country,
    },
    taxId: companySettings.taxId,
    logo: companySettings.logo,
  };
};

// Default company info fallback
export const getDefaultCompanyInfo = (): CompanyInfo => {
  return {
    name: 'Your Company Name',
    email: 'contact@yourcompany.com',
    phone: '+1 (555) 123-4567',
    website: 'www.yourcompany.com',
    address: {
      street: '123 Business Street',
      city: 'Business City',
      state: 'BC',
      zipCode: '12345',
      country: 'USA'
    },
    taxId: 'TAX123456789'
  };
};
