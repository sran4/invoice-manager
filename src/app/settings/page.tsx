'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Settings, 
  User, 
  Building, 
  Palette, 
  Bell, 
  Shield, 
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface CompanySettings {
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

interface UserPreferences {
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

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    taxId: '',
    logo: ''
  });

  const [userPreferences, setUserPreferences] = useState<Omit<UserPreferences, 'theme'>>({
    notifications: {
      email: true,
      browser: true,
      invoiceReminders: true,
      paymentReminders: true
    },
    invoiceDefaults: {
      dueDays: 30,
      taxRate: 8.25,
      currency: 'USD',
      template: 'modern'
    }
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    loadSettings();
  }, [session, status, router]);

  const loadSettings = async () => {
    try {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.success) {
        if (data.companySettings) {
          setCompanySettings(data.companySettings);
        } else {
          // Set default values if no company settings exist
          setCompanySettings({
            name: '',
            email: session.user.email,
            phone: '',
            website: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'USA'
            },
            taxId: '',
            logo: ''
          });
        }
        
        if (data.preferences) {
          setUserPreferences(data.preferences);
        }
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companySettings,
          preferences: userPreferences,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanySettings(prev => ({
          ...prev,
          logo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const tabs = [
    { id: 'company', name: 'Company', icon: Building },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="pt-20 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2 float-animation">Settings</h1>
          <p className="text-slate-600 text-lg">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatedCard className="gradient-card">
              <CardHeader>
                <CardTitle className="gradient-text">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-red-100 to-blue-100 text-red-700'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </motion.button>
                  );
                })}
              </CardContent>
            </AnimatedCard>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {activeTab === 'company' && (
                <AnimatedCard delay={0.3} className="gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gradient-text">
                      <Building className="h-6 w-6 mr-2" />
                      Company Information
                    </CardTitle>
                    <CardDescription>
                      Update your company details and branding
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label>Company Logo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-blue-100 rounded-lg flex items-center justify-center">
                          {companySettings.logo ? (
                            <img src={companySettings.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Building className="h-8 w-8 text-red-500" />
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Logo
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          value={companySettings.name}
                          onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                          className="border-red-200 focus:border-red-400 focus:ring-red-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-email">Email</Label>
                        <Input
                          id="company-email"
                          type="email"
                          value={companySettings.email}
                          onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                          className="border-red-200 focus:border-red-400 focus:ring-red-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-phone">Phone</Label>
                        <Input
                          id="company-phone"
                          value={companySettings.phone}
                          onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                          className="border-red-200 focus:border-red-400 focus:ring-red-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-website">Website</Label>
                        <Input
                          id="company-website"
                          value={companySettings.website}
                          onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                          className="border-red-200 focus:border-red-400 focus:ring-red-200"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Address</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={companySettings.address.street}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              address: { ...prev.address, street: e.target.value }
                            }))}
                            className="border-red-200 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={companySettings.address.city}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              address: { ...prev.address, city: e.target.value }
                            }))}
                            className="border-red-200 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={companySettings.address.state}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              address: { ...prev.address, state: e.target.value }
                            }))}
                            className="border-red-200 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={companySettings.address.zipCode}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              address: { ...prev.address, zipCode: e.target.value }
                            }))}
                            className="border-red-200 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={companySettings.address.country}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              address: { ...prev.address, country: e.target.value }
                            }))}
                            className="border-red-200 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tax ID */}
                    <div className="space-y-2">
                      <Label htmlFor="tax-id">Tax ID / EIN</Label>
                      <Input
                        id="tax-id"
                        value={companySettings.taxId}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, taxId: e.target.value }))}
                        className="border-red-200 focus:border-red-400 focus:ring-red-200"
                      />
                    </div>
                  </CardContent>
                </AnimatedCard>
              )}

              {activeTab === 'preferences' && (
                <AnimatedCard delay={0.3} className="gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gradient-text">
                      <Palette className="h-6 w-6 mr-2" />
                      User Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience and default settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Theme */}
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={theme}
                        onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'auto')}
                      >
                        <SelectTrigger className="border-red-200 focus:border-red-400 focus:ring-red-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Invoice Defaults */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Invoice Defaults</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="due-days">Default Due Days</Label>
                          <Input
                            id="due-days"
                            type="number"
                            value={userPreferences.invoiceDefaults.dueDays}
                            onChange={(e) => setUserPreferences(prev => ({
                              ...prev,
                              invoiceDefaults: { ...prev.invoiceDefaults, dueDays: parseInt(e.target.value) }
                            }))}
                            className="border-red-200 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                          <Input
                            id="tax-rate"
                            type="number"
                            step="0.01"
                            value={userPreferences.invoiceDefaults.taxRate}
                            onChange={(e) => setUserPreferences(prev => ({
                              ...prev,
                              invoiceDefaults: { ...prev.invoiceDefaults, taxRate: parseFloat(e.target.value) }
                            }))}
                            className="border-red-200 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={userPreferences.invoiceDefaults.currency}
                            onValueChange={(value) => setUserPreferences(prev => ({
                              ...prev,
                              invoiceDefaults: { ...prev.invoiceDefaults, currency: value }
                            }))}
                          >
                            <SelectTrigger className="border-red-200 focus:border-red-400 focus:ring-red-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="template">Default Template</Label>
                          <Select
                            value={userPreferences.invoiceDefaults.template}
                            onValueChange={(value) => setUserPreferences(prev => ({
                              ...prev,
                              invoiceDefaults: { ...prev.invoiceDefaults, template: value }
                            }))}
                          >
                            <SelectTrigger className="border-red-200 focus:border-red-400 focus:ring-red-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              )}

              {activeTab === 'notifications' && (
                <AnimatedCard delay={0.3} className="gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gradient-text">
                      <Bell className="h-6 w-6 mr-2" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Manage your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Email Notifications</Label>
                          <p className="text-sm text-slate-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={userPreferences.notifications.email}
                          onCheckedChange={(checked) => setUserPreferences(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Browser Notifications</Label>
                          <p className="text-sm text-slate-600">Show browser notifications</p>
                        </div>
                        <Switch
                          checked={userPreferences.notifications.browser}
                          onCheckedChange={(checked) => setUserPreferences(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, browser: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Invoice Reminders</Label>
                          <p className="text-sm text-slate-600">Remind about upcoming due dates</p>
                        </div>
                        <Switch
                          checked={userPreferences.notifications.invoiceReminders}
                          onCheckedChange={(checked) => setUserPreferences(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, invoiceReminders: checked }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Payment Reminders</Label>
                          <p className="text-sm text-slate-600">Remind about overdue payments</p>
                        </div>
                        <Switch
                          checked={userPreferences.notifications.paymentReminders}
                          onCheckedChange={(checked) => setUserPreferences(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, paymentReminders: checked }
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              )}

              {activeTab === 'security' && (
                <AnimatedCard delay={0.3} className="gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gradient-text">
                      <Shield className="h-6 w-6 mr-2" />
                      Security
                    </CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-red-50 to-blue-50 rounded-lg">
                        <h3 className="font-medium text-slate-900 mb-2">Change Password</h3>
                        <p className="text-sm text-slate-600 mb-4">Update your account password</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                            Change Password
                          </Button>
                        </motion.div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-red-50 to-blue-50 rounded-lg">
                        <h3 className="font-medium text-slate-900 mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-600 mb-4">Add an extra layer of security</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                            Enable 2FA
                          </Button>
                        </motion.div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-red-50 to-blue-50 rounded-lg">
                        <h3 className="font-medium text-slate-900 mb-2">Export Data</h3>
                        <p className="text-sm text-slate-600 mb-4">Download your account data</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              )}

              {/* Save Button */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="gradient-button text-white border-0 w-full"
                  >
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
