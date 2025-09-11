'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  Edit,
  Calendar,
  DollarSign,
  FileText,
  User
} from 'lucide-react';

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

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
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
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.invoice);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert('PDF export feature will be implemented next!');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || !invoice) {
    return null;
  }

  return (
    <div className="pt-20 p-6">
      <div className="max-w-4xl mx-auto">
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
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900">Invoice {invoice.invoiceNumber}</h1>
              <p className="text-slate-600 text-lg">
                Created on {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => router.push(`/invoices/${invoice._id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Invoice Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Invoice Details</span>
                  <span className="text-2xl font-bold">${invoice.total.toLocaleString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Invoice Number</h3>
                    <p className="text-slate-600">{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Template</h3>
                    <p className="text-slate-600 capitalize">{invoice.template.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Issue Date</h3>
                    <p className="text-slate-600">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                  </div>
                  {invoice.dueDate && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Due Date</h3>
                      <p className="text-slate-600">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoice.items.map((item, index) => (
                    <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.description}</h4>
                        <p className="text-sm text-slate-600">
                          {item.quantity} × ${item.rate.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {invoice.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
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
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/invoices/${invoice._id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Invoice
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/invoices')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
