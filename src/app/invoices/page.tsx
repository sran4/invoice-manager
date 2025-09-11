'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search,
  Eye,
  Download,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  User,
  ChevronDown,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerId: string;
  issueDate: string;
  dueDate?: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  template: string;
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [invoicesLoaded, setInvoicesLoaded] = useState(false);
  const [customersLoaded, setCustomersLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchInvoices(1, searchTerm);
    fetchCustomers();
  }, [session, status, router]);

  // Handle search with debouncing
  useEffect(() => {
    if (status === 'loading' || !session) return;
    
    const timeoutId = setTimeout(() => {
      fetchInvoices(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (invoicesLoaded && customersLoaded) {
      setLoading(false);
    }
  }, [invoicesLoaded, customersLoaded]);

  const fetchInvoices = async (page: number = 1, search: string = '') => {
    try {
      setSearchLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });
      
      const response = await fetch(`/api/invoices?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched invoices:', data.invoices);
        console.log('Pagination info:', data.pagination);
        setInvoices(data.invoices || []);
        setPagination(data.pagination || null);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setInvoicesLoaded(true);
      setSearchLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched customers:', data.customers);
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setCustomersLoaded(true);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh current page after deletion
        fetchInvoices(currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleUpdateStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Refresh current page after status update
        fetchInvoices(currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      // For now, we'll show a toast message since PDF export is not implemented yet
      // TODO: Implement actual PDF generation
      alert('PDF export feature will be implemented next!');
      
      // Future implementation:
      // const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      // if (response.ok) {
      //   const blob = await response.blob();
      //   const url = window.URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = `invoice-${invoiceId}.pdf`;
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      // }
    } catch (error) {
      console.error('Error downloading PDF:', error);
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

  const getCustomerDetails = (customerId: string) => {
    const customer = customers.find(c => c._id === customerId);
    if (!customer) {
      console.log('Customer not found for ID:', customerId);
      console.log('Available customers:', customers.map(c => ({ id: c._id, name: c.name })));
      return { name: 'Unknown Customer', city: 'Unknown City', phone: 'No Phone' };
    }
    return {
      name: customer.name,
      city: customer.address.city,
      phone: customer.phone || 'No Phone'
    };
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchInvoices(page, searchTerm);
  };

  const handlePrevPage = () => {
    if (pagination?.hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  // Note: Stats are now based on pagination total count, not current page invoices
  const stats = {
    total: pagination?.totalCount || 0,
    paid: 0, // These would need separate API calls for accurate counts
    pending: 0,
    overdue: 0,
    draft: 0,
    totalRevenue: 0,
    totalValue: 0
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2 float-animation">Invoices</h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Manage and track all your invoices
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className="gradient-button text-white border-0" 
                onClick={() => router.push('/invoices/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <AnimatedCard delay={0.1} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="h-4 w-4 text-red-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {stats.total}
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="h-4 w-4 text-purple-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                {stats.draft}
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <DollarSign className="h-4 w-4 text-green-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {stats.paid}
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Calendar className="h-4 w-4 text-blue-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                {stats.pending}
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.5} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <DollarSign className="h-4 w-4 text-green-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                ${stats.totalRevenue.toLocaleString()}
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.6} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <DollarSign className="h-4 w-4 text-cyan-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                ${stats.totalValue.toLocaleString()}
              </motion.div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Search */}
        <AnimatedCard delay={0.7} className="gradient-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gradient-text">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Search className="h-5 w-5 mr-2 text-red-500" />
              </motion.div>
              Search Invoices
              {searchLoading && (
                <motion.div
                  className="ml-2 h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-red-200 focus:border-red-400 focus:ring-red-200"
            />
            {pagination && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, pagination.totalCount)} of {pagination.totalCount} invoices
              </p>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <AnimatedCard delay={0.8} className="gradient-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <FileText className="h-16 w-16 text-red-400 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold gradient-text mb-2">
                {searchTerm ? 'No invoices found' : 'No invoices yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-center">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first invoice to get started'
                }
              </p>
              {!searchTerm && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="gradient-button text-white border-0" 
                    onClick={() => router.push('/invoices/create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Invoice
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </AnimatedCard>
        ) : (
          <>
            <div className="space-y-4">
              {invoices.map((invoice, index) => (
              <motion.div
                key={invoice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="gradient-card hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-red-100 to-blue-100 rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FileText className="h-6 w-6 text-red-600" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {getCustomerDetails(invoice.customerId).name}, {getCustomerDetails(invoice.customerId).city}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {getCustomerDetails(invoice.customerId).phone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'No due date'}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${invoice.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                        <Select 
                          value={invoice.status} 
                          onValueChange={(value) => handleUpdateStatus(invoice._id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
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
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/invoices/${invoice._id}`)}
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadPDF(invoice._id)}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/invoices/${invoice._id}/edit`)}
                          title="Edit Invoice"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice._id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <AnimatedCard delay={0.9} className="gradient-card mt-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={!pagination.hasPrevPage}
                        className="flex items-center space-x-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === pagination.currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 p-0 ${
                                pageNum === pagination.currentPage 
                                  ? 'gradient-button text-white border-0' 
                                  : ''
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage}
                        className="flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}
