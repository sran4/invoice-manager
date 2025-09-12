'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { generateInvoicePDF, fetchCompanySettings, getDefaultCompanyInfo } from '@/lib/pdf-export';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerId: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  issueDate: string;
  dueDate?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  template: string;
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setInvoiceId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (status === 'loading' || !invoiceId) return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchInvoice();
  }, [session, status, router, invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/export`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.invoice);
        setCustomer(data.customer);
      } else {
        router.push('/invoices');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      router.push('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!invoice || !invoiceId) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: invoice.status,
          notes: invoice.notes
        }),
      });

      if (response.ok) {
        toast.success('Invoice updated successfully!');
        router.push(`/invoices/${invoiceId}`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice || !customer) {
      toast.error('Invoice or customer data not available');
      return;
    }

    try {
      const companyInfo = await fetchCompanySettings() || getDefaultCompanyInfo();
      await generateInvoicePDF(invoice, customer, companyInfo);
      toast.success('Invoice PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || !invoice || !customer) {
    return null;
  }

  return (
    <div className="pt-20 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Edit Invoice {invoice.invoiceNumber}</h1>
              <p className="text-slate-600 text-lg">
                Update invoice details and status
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <AnimatedCard delay={0.1} className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gradient-text">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FileText className="h-5 w-5 mr-2 text-red-500" />
                </motion.div>
                Invoice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoice.invoiceNumber}
                  readOnly
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={invoice.status} 
                  onValueChange={(value) => setInvoice({...invoice, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={invoice.issueDate.split('T')[0]}
                  readOnly
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoice.dueDate ? invoice.dueDate.split('T')[0] : ''}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Financial Summary */}
          <AnimatedCard delay={0.2} className="gradient-card">
            <CardHeader>
              <CardTitle className="gradient-text">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Notes */}
        <AnimatedCard delay={0.3} className="gradient-card mt-8">
          <CardHeader>
            <CardTitle className="gradient-text">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={invoice.notes || ''}
              onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
              placeholder="Add any additional notes..."
              rows={4}
            />
          </CardContent>
        </AnimatedCard>

        {/* Action Buttons */}
        <motion.div 
          className="flex items-center justify-end space-x-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={saving}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="min-w-[120px] gradient-button text-white border-0"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
