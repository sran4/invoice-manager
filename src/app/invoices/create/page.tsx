'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
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
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workDescriptions, setWorkDescriptions] = useState<WorkDescription[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-blue');
  const [userSettings, setUserSettings] = useState<{
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

  // Template configurations
  const templateConfigs = {
    'modern-blue': {
      gradient: 'from-blue-500 to-cyan-500',
      name: 'Modern Blue'
    },
    'classic-purple': {
      gradient: 'from-purple-500 to-pink-500',
      name: 'Classic Purple'
    },
    'minimal-gray': {
      gradient: 'from-gray-600 to-gray-800',
      name: 'Minimal Gray'
    },
    'professional-green': {
      gradient: 'from-green-500 to-emerald-500',
      name: 'Professional Green'
    },
    'creative-orange': {
      gradient: 'from-orange-500 to-red-500',
      name: 'Creative Orange'
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
    items: [{
      id: 'default-item-1',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }] as InvoiceItem[]
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Get selected template from localStorage
    const template = localStorage.getItem('selectedTemplate');
    if (template) {
      setSelectedTemplate(template);
    }
    
    fetchCustomers();
    fetchWorkDescriptions();
    fetchUserSettings();
    generateInvoiceNumber();
  }, [session, status, router]);

  // Update due date when issue date changes
  useEffect(() => {
    if (userSettings?.preferences?.invoiceDefaults?.dueDays && formData.issueDate) {
      const dueDays = userSettings.preferences.invoiceDefaults.dueDays;
      const issueDate = new Date(formData.issueDate);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + dueDays);
      
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issueDate, userSettings]);

  // Apply tax rate from user settings
  useEffect(() => {
    if (userSettings?.preferences?.invoiceDefaults?.taxRate !== undefined) {
      setFormData(prev => ({
        ...prev,
        taxRate: Number(userSettings.preferences.invoiceDefaults.taxRate) || 0
      }));
    }
  }, [userSettings]);

  // Ensure there's always at least one item
  useEffect(() => {
    if (formData.items.length === 0) {
      const defaultItem: InvoiceItem = {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      };
      setFormData(prev => ({
        ...prev,
        items: [defaultItem]
      }));
    }
  }, [formData.items.length]);

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
        
        // Check if there's a customer parameter in the URL
        const customerParam = searchParams.get('customer');
        if (customerParam && data.customers) {
          const customerExists = data.customers.find((c: Customer) => c._id === customerParam);
          if (customerExists) {
            setFormData(prev => ({ ...prev, customerId: customerParam }));
          }
        }
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
        setUserSettings(data);
        
        // Pre-populate due date if settings are available
        if (data.preferences?.invoiceDefaults?.dueDays) {
          const dueDays = data.preferences.invoiceDefaults.dueDays;
          const issueDate = new Date(formData.issueDate);
          const dueDate = new Date(issueDate);
          dueDate.setDate(dueDate.getDate() + dueDays);
          
          setFormData(prev => ({
            ...prev,
            dueDate: dueDate.toISOString().split('T')[0]
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const generateInvoiceNumber = async () => {
    try {
      const response = await fetch('/api/invoices/next-number');
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, invoiceNumber: data.invoiceNumber }));
      }
    } catch (error) {
      console.error('Error generating invoice number:', error);
      // Fallback to manual number
      setFormData(prev => ({ ...prev, invoiceNumber: 'INV-1000' }));
    }
  };

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
    setFormData(prev => {
      // Don't allow removing the last item
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
  };

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
    return Object.values(errors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateAllFields()) {
      toast.error('Please fix the errors below');
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

      console.log('Sending invoice data:', invoiceData);
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

      if (response.ok) {
        toast.success('Invoice created successfully!');
        router.push('/invoices');
      } else {
        const error = await response.json();
        console.error('Invoice creation error:', error);
        toast.error(error.error || error.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
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
              <p className="text-slate-600 text-lg">
                Create a new invoice using the <span className={`font-semibold bg-gradient-to-r ${currentTemplate.gradient} bg-clip-text text-transparent`}>{currentTemplate.name}</span> template
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
                        placeholder="Search customers by name or email..."
                      />
                    </div>
                    {fieldErrors.customerId && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.customerId}</p>
                    )}
                  </div>
                  
                  {customers.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-slate-600 mb-2">No customers found</p>
                      <Button type="button" variant="outline" onClick={() => router.push('/customers/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                      </Button>
                    </div>
                  )}
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
                        <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                          className={`pl-10 ${fieldErrors.invoiceNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                          required
                        />
                      </div>
                      {fieldErrors.invoiceNumber && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.invoiceNumber}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <div className="relative">
                        <GradientTooltip content="Go to Settings to change default due days">
                          <div className="flex items-center justify-between h-10 px-3 border border-slate-600 rounded-lg bg-slate-800 cursor-help">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-4 w-4 text-slate-300" />
                              <span className="text-white">
                                {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Calculating...'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="p-0.5 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full">
                                <Settings className="h-2.5 w-2.5 text-white" />
                              </div>
                            </div>
                          </div>
                        </GradientTooltip>
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label>Invoice Template</Label>
                    <div className="flex items-center justify-between p-3 border border-slate-600 rounded-lg bg-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${currentTemplate.gradient}`}>
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">
                            {currentTemplate.name}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-white">Modern Blue</p>
                          <p className="text-sm text-slate-300">Current template</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/templates')}
                        className="border-slate-500 text-white hover:bg-slate-700 hover:text-white hover:border-slate-400"
                      >
                        Change Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Descriptions */}
              {workDescriptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Add Work Descriptions</CardTitle>
                    <CardDescription>
                      Add pre-saved work descriptions to speed up invoice creation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {workDescriptions.map((workDescription) => (
                        <Button
                          key={workDescription._id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addWorkDescription(workDescription)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {workDescription.title}
                        </Button>
                      ))}
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
                  {fieldErrors.items && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{fieldErrors.items}</p>
                    </div>
                  )}
                  {formData.items.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <p>No items added yet. Click "Add Item" to get started.</p>
                    </div>
                  ) : (
                    formData.items.map((item, index) => (
                      <div key={item.id} className={`grid grid-cols-12 gap-4 items-end p-4 border rounded-lg ${fieldErrors.items ? 'border-red-300' : ''}`}>
                        <div className="col-span-5 space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Item description..."
                            rows={2}
                          />
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
                          />
                        </div>
                        
                        <div className="col-span-2 space-y-2">
                          <Label>Rate</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate === 0 ? '' : item.rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              updateItem(item.id, 'rate', value === '' ? 0 : parseFloat(value) || 0);
                            }}
                          />
                        </div>
                        
                        <div className="col-span-2 space-y-2">
                          <Label>Amount</Label>
                          <Input
                            type="number"
                            value={item.amount}
                            readOnly
                            className="bg-slate-50"
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
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any additional notes or terms..."
                    rows={4}
                  />
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
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax ({formData.taxRate}%):</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Discount ({formData.discount}%):</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
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
                      />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={loading}
                      className="w-24"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || formData.items.length === 0}
                      className={`flex-1 bg-gradient-to-r ${currentTemplate.gradient} hover:opacity-90 text-white border-0`}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Invoice
                        </>
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
