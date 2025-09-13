'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CustomerSearch } from '@/components/ui/customer-search';
import { GradientTooltip } from '@/components/ui/gradient-tooltip';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  Calculator,
  FileText,
  User,
  DollarSign,
  Calendar,
  Hash,
  Settings,
  Palette,
  Layout,
  Sparkles,
  Briefcase,
  Zap,
  Loader2,
  Search,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface WorkDescription {
  _id: string;
  title: string;
  description: string;
  rate: number;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function CreateInvoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workDescriptions, setWorkDescriptions] = useState<WorkDescription[]>([]);
  const [workDescriptionSearch, setWorkDescriptionSearch] = useState('');
  const [showWorkDescriptionDropdown, setShowWorkDescriptionDropdown] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-blue');
  const [userSettings, setUserSettings] = useState<{
    companySettings?: {
      companyName?: string;
      email?: string;
      phone?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      };
    };
    preferences?: {
      invoiceDefaults?: {
        dueDays?: number;
        taxRate?: number;
        currency?: string;
        template?: string;
      };
    };
  } | null>(null);
  
  const [fieldErrors, setFieldErrors] = useState<{
    customerId?: string;
    invoiceNumber?: string;
    items?: string;
  }>({});

  // Template configurations (matching templates page IDs)
  const templateConfigs = {
    'modern-blue': {
      gradient: 'from-blue-500 to-cyan-500',
      name: 'Modern Blue',
      icon: Layout,
      iconColor: 'text-blue-400'
    },
    'classic-green': {
      gradient: 'from-green-500 to-emerald-500',
      name: 'Classic Green',
      icon: FileText,
      iconColor: 'text-green-400'
    },
    'minimal-purple': {
      gradient: 'from-purple-500 to-pink-500',
      name: 'Minimal Purple',
      icon: Sparkles,
      iconColor: 'text-purple-400'
    },
    'professional-gray': {
      gradient: 'from-gray-600 to-slate-600',
      name: 'Professional Gray',
      icon: Briefcase,
      iconColor: 'text-gray-400'
    },
    'creative-orange': {
      gradient: 'from-orange-500 to-red-500',
      name: 'Creative Orange',
      icon: Palette,
      iconColor: 'text-orange-400'
    }
  };

  const currentTemplate = templateConfigs[selectedTemplate as keyof typeof templateConfigs] || templateConfigs['modern-blue'];

  const [formData, setFormData] = useState({
    customerId: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    taxRate: 0,
    discount: 0,
    companyName: '',
    currency: 'USD',
    items: []
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Get selected template from localStorage
    const template = localStorage.getItem('selectedTemplate');
    console.log('Loading template from localStorage:', template);
    if (template) {
      setSelectedTemplate(template);
      console.log('Set selected template to:', template);
    }
    
    fetchCustomers();
    fetchWorkDescriptions();
    fetchUserSettings();
    fetchInvoiceNumber();
    setLoading(false);
  }, [session, status, router]);

  // Listen for template changes from templates page
  useEffect(() => {
    const handleStorageChange = () => {
      const template = localStorage.getItem('selectedTemplate');
      console.log('Storage change detected, template:', template, 'current:', selectedTemplate);
      if (template && template !== selectedTemplate) {
        console.log('Changing template from', selectedTemplate, 'to', template);
        setSelectedTemplate(template);
        toast.success(`Template changed to ${templateConfigs[template as keyof typeof templateConfigs]?.name || template}`, {
          description: 'Your invoice will now use this beautiful template.',
          duration: 3000,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [selectedTemplate]);

  // Update due date when issue date changes
  useEffect(() => {
    if (formData.issueDate) {
      const dueDays = userSettings?.preferences?.invoiceDefaults?.dueDays || 30; // Default to 30 days if not set
      const issueDate = new Date(formData.issueDate);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + dueDays);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issueDate, userSettings]);

  // Real-time validation for customer selection
  useEffect(() => {
    if (formData.customerId) {
      setFieldErrors(prev => ({ ...prev, customerId: '' }));
    }
  }, [formData.customerId]);

  // Real-time validation for invoice number
  useEffect(() => {
    if (formData.invoiceNumber) {
      setFieldErrors(prev => ({ ...prev, invoiceNumber: '' }));
    }
  }, [formData.invoiceNumber]);

  // Real-time validation for invoice items
  useEffect(() => {
    if (formData.items.length > 0 && formData.items.some(item => item.description.trim())) {
      setFieldErrors(prev => ({ ...prev, items: '' }));
    }
  }, [formData.items]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchWorkDescriptions = async () => {
    try {
      const response = await fetch('/api/work-descriptions');
      if (response.ok) {
        const data = await response.json();
        setWorkDescriptions(data.workDescriptions || []);
      }
    } catch (error) {
      console.error('Error fetching work descriptions:', error);
    }
  };

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setUserSettings({
          companySettings: data.companySettings,
          preferences: data.preferences
        });
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const fetchInvoiceNumber = async () => {
    try {
      const response = await fetch('/api/invoices/next-number');
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, invoiceNumber: data.invoiceNumber }));
      }
    } catch (error) {
      console.error('Error fetching invoice number:', error);
    }
  };

  // Apply user preferences to form defaults
  useEffect(() => {
    if (userSettings?.preferences?.invoiceDefaults) {
      const defaults = userSettings.preferences.invoiceDefaults;
      
      // Set tax rate
      if (defaults.taxRate !== undefined && defaults.taxRate !== null) {
        setFormData(prev => ({
          ...prev,
          taxRate: Number(defaults.taxRate) || 0
        }));
      }
      
      // Set currency
      if (defaults.currency) {
        setFormData(prev => ({
          ...prev,
          currency: defaults.currency
        }));
      }
      
      // Set default template if not already set from localStorage
      if (defaults.template && !localStorage.getItem('selectedTemplate')) {
        setSelectedTemplate(defaults.template);
      }
    }
  }, [userSettings]);

  // Pre-select customer from URL parameter
  useEffect(() => {
    const customerId = searchParams.get('customer');
    if (customerId && customers.length > 0) {
      setFormData(prev => ({ ...prev, customerId }));
    }
  }, [searchParams, customers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowWorkDescriptionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    if (formData.items.length <= 1) return; // Prevent removing the last item
    setFormData(prev => {
      if (prev.items.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      };
    });
  };

  const updateItem = (itemId: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addWorkDescription = (workDescription: WorkDescription) => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: workDescription.description,
      quantity: 1,
      rate: workDescription.rate,
      amount: workDescription.rate
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    // Clear search and close dropdown after adding
    setWorkDescriptionSearch('');
    setShowWorkDescriptionDropdown(false);
    toast.success('Work description added to invoice');
  };

  // Filter work descriptions based on search
  const filteredWorkDescriptions = workDescriptions.filter(workDescription =>
    workDescription.title.toLowerCase().includes(workDescriptionSearch.toLowerCase()) ||
    workDescription.description.toLowerCase().includes(workDescriptionSearch.toLowerCase())
  );

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * formData.taxRate) / 100;
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * formData.discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const formatCurrency = (amount: number) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$'
    };
    const symbol = symbols[formData.currency as keyof typeof symbols] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'customerId':
        return !value ? 'Please select a customer' : '';
      case 'invoiceNumber':
        return !value ? 'Invoice number is required' : '';
      case 'items':
        if (!value || value.length === 0) {
          return 'Please add at least one invoice item';
        }
        if (value.every((item: any) => !item.description.trim())) {
          return 'Please add descriptions to invoice items';
        }
        // Check for missing rates
        const itemsWithoutRate = value.filter((item: any) => !item.rate || item.rate <= 0);
        if (itemsWithoutRate.length > 0) {
          return 'Please enter a valid rate for all invoice items';
        }
        return '';
      default:
        return '';
    }
  };

  const validateAllFields = () => {
    const errors: { [key: string]: string } = {};
    
    errors.customerId = validateField('customerId', formData.customerId);
    errors.invoiceNumber = validateField('invoiceNumber', formData.invoiceNumber);
    errors.items = validateField('items', formData.items);
    
    setFieldErrors(errors);
    
    const hasFieldErrors = Object.values(errors).some(error => error);
    
    return !hasFieldErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateAllFields()) {
      const hasCustomerError = fieldErrors.customerId;
      const hasInvoiceNumberError = fieldErrors.invoiceNumber;
      const hasItemsError = fieldErrors.items;
      
      let errorMessage = 'Please fix the following issues:';
      let errorDescription = '';
      
      if (hasCustomerError) {
        errorDescription += '• Select a customer\n';
      }
      if (hasInvoiceNumberError) {
        errorDescription += '• Enter invoice number\n';
      }
      if (hasItemsError) {
        errorDescription += '• ' + hasItemsError + '\n';
      }
      
      toast.error(errorMessage, {
        description: errorDescription.trim(),
        duration: 8000,
      });
      return;
    }
    
    setLoading(true);

    try {
      const invoiceData = {
        ...formData,
        template: selectedTemplate,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: calculateDiscount(),
        total: calculateTotal()
      };

      console.log('Submitting invoice data:', invoiceData);
      console.log('Form data:', formData);
      console.log('Calculated values:', {
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: calculateDiscount(),
        total: calculateTotal()
      });

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok) {
        toast.success('Invoice created successfully!', {
          description: 'Your invoice has been saved and is ready to send.',
          duration: 4000,
        });
        router.push('/invoices');
      } else {
        console.error('API Error:', result);
        toast.error(result.error || result.message || 'Failed to create invoice');
      }
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.error || error.message || 'An error occurred while creating the invoice');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="pt-20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Create Invoice</h1>
              <p className="text-slate-300 text-lg">
                Create a new invoice using the <span className={`font-semibold bg-gradient-to-r ${currentTemplate.gradient} bg-clip-text text-transparent`}>{currentTemplate.name}</span> template
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={loading ? 'cursor-not-allowed' : ''}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Select Customer *</Label>
                    <div className={fieldErrors.customerId ? 'border border-red-300 rounded-lg' : ''}>
                      <CustomerSearch
                        customers={customers}
                        selectedCustomerId={formData.customerId}
                        onCustomerSelect={(customerId) => setFormData(prev => ({ ...prev, customerId }))}
                        placeholder="Search for a customer..."
                        className="w-full"
                      />
                    </div>
                    {fieldErrors.customerId && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.customerId}</p>
                    )}
                    <div className="mt-2">
                      <a 
                        href="/customers/new" 
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
                      >
                        + Create New Customer
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Invoice Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                        <Input
                          id="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                          className="pl-10 text-slate-200"
                          autoComplete="off"
                          placeholder="Auto-generated"
                        />
                      </div>
                      {fieldErrors.invoiceNumber && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.invoiceNumber}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                        <Input
                          id="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                          className="pl-10 text-slate-200 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                        <div className="flex items-center">
                          <Input
                            id="dueDate"
                            type="text"
                            value={formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : ''}
                            readOnly
                            className="pl-10 pr-10 bg-slate-50 text-slate-200"
                            placeholder="Auto-calculated"
                          />
                          <GradientTooltip
                            content="Due date is auto-calculated from issue date. You can change the default number of days in Settings."
                          >
                            <Settings className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400 cursor-help hover:text-purple-400 transition-colors duration-200" />
                          </GradientTooltip>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label>Invoice Template</Label>
                    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${currentTemplate.gradient} bg-opacity-20 border border-slate-600`}>
                            <currentTemplate.icon className={`w-5 h-5 ${currentTemplate.iconColor}`} />
                          </div>
                          <span className="font-medium text-white">{currentTemplate.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => router.push('/templates')}
                          className={`bg-gradient-to-r ${currentTemplate.gradient} text-white border-0 hover:opacity-90 hover:bg-gradient-to-r ${currentTemplate.gradient} cursor-pointer`}
                        >
                          Change Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Description Search */}
              {workDescriptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-400" />
                      Add Work Description
                    </CardTitle>
                    <CardDescription>
                      Search and add pre-saved work descriptions to your invoice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative" ref={searchDropdownRef}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Search work descriptions..."
                          value={workDescriptionSearch}
                          onChange={(e) => {
                            setWorkDescriptionSearch(e.target.value);
                            setShowWorkDescriptionDropdown(true);
                          }}
                          onFocus={() => setShowWorkDescriptionDropdown(true)}
                          className="pl-10 pr-10 bg-white/10 dark:bg-slate-700/20 border-white/20 dark:border-slate-600/20 text-white placeholder:text-slate-400 focus:ring-blue-400 focus:border-blue-400 backdrop-blur-sm transition-all duration-300"
                        />
                        {workDescriptionSearch && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setWorkDescriptionSearch('');
                              setShowWorkDescriptionDropdown(false);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Dropdown Results */}
                      {showWorkDescriptionDropdown && workDescriptionSearch && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                          {filteredWorkDescriptions.length > 0 ? (
                            <div className="p-2">
                              {filteredWorkDescriptions.map((workDescription) => (
                                <div
                                  key={workDescription._id}
                                  onClick={() => addWorkDescription(workDescription)}
                                  className="p-3 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg cursor-pointer transition-all duration-200 border-b border-white/10 dark:border-slate-700/20 last:border-b-0"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-slate-900 dark:text-white truncate">
                                        {workDescription.title}
                                      </h4>
                                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                                        {workDescription.description}
                                      </p>
                                      {workDescription.rate > 0 && (
                                        <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                                          <DollarSign className="h-3 w-3 mr-1" />
                                          <span>${workDescription.rate.toFixed(2)}/hour</span>
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No work descriptions found</p>
                              <p className="text-sm">Try a different search term</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Invoice Items</CardTitle>
                    <Button type="button" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.items.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <p>No items added yet. Click "Add Item" to get started.</p>
                    </div>
                  ) : (
                    formData.items.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-5 space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Description *</Label>
                              <span className="text-xs text-slate-400">
                                {item.description.length}/200
                              </span>
                            </div>
                            <Textarea
                              value={item.description}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 200) {
                                  updateItem(item.id, 'description', value);
                                }
                              }}
                              placeholder="Item description..."
                              rows={2}
                              className="text-slate-200"
                              maxLength={200}
                            />
                            {item.description.length > 180 && (
                              <p className="text-xs text-amber-500">
                                ⚠️ Approaching character limit for clean printing
                              </p>
                            )}
                          </div>
                          
                          <div className="col-span-2 space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity === 0 ? '' : item.quantity}
                              onChange={(e) => {
                                const value = e.target.value;
                                updateItem(item.id, 'quantity', value === '' ? 0 : parseFloat(value) || 0);
                              }}
                              autoComplete="off"
                              className="text-slate-200"
                            />
                          </div>
                          
                          <div className="col-span-2 space-y-2">
                            <Label>Rate *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate === 0 ? '' : item.rate}
                              onChange={(e) => {
                                const value = e.target.value;
                                updateItem(item.id, 'rate', value === '' ? 0 : parseFloat(value) || 0);
                              }}
                              autoComplete="off"
                              className="text-slate-200"
                            />
                          </div>
                        
                          <div className="col-span-2 space-y-2">
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              value={item.amount}
                              readOnly
                              className="bg-slate-50 text-slate-200"
                            />
                          </div>
                          
                          <div className="col-span-1">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              disabled={formData.items.length <= 1}
                              className={`p-2 rounded-md transition-colors ${
                                formData.items.length <= 1 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Additional Notes</CardTitle>
                    <span className="text-xs text-slate-400">
                      {formData.notes.length}/500
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        setFormData(prev => ({ ...prev, notes: value }));
                      }
                    }}
                    placeholder="Add any additional notes or terms..."
                    rows={4}
                    className="text-slate-200 placeholder:text-slate-400 focus:text-slate-100 focus:placeholder:text-slate-500"
                    maxLength={500}
                  />
                  {formData.notes.length > 450 && (
                    <p className="text-xs text-amber-500 mt-2">
                      ⚠️ Approaching character limit for clean printing
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    💡 Keep notes concise for professional invoice appearance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Calculations */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Invoice Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax ({formData.taxRate}%):</span>
                      <span>{formatCurrency(calculateTax())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Discount ({formData.discount}%):</span>
                      <span>-{formatCurrency(calculateDiscount())}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.taxRate === 0 ? '' : formData.taxRate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({ 
                            ...prev, 
                            taxRate: value === '' ? 0 : parseFloat(value) || 0 
                          }));
                        }}
                        autoComplete="off"
                        className="text-slate-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.discount === 0 ? '' : formData.discount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({ 
                            ...prev, 
                            discount: value === '' ? 0 : parseFloat(value) || 0 
                          }));
                        }}
                        autoComplete="off"
                        className="text-slate-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger className="text-slate-200">
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
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/invoices')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`w-full bg-gradient-to-r ${currentTemplate.gradient} text-white border-0 hover:opacity-90 cursor-pointer ${loading ? 'cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-500" />
                          <span className="text-red-500">Creating Invoice...</span>
                        </>
                      ) : (
                        'Create Invoice'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}