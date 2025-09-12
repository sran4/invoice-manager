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
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  companyName?: string;
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchInvoices(1, searchTerm, statusFilter);
    fetchCustomers();
    fetchAllInvoices();
  }, [session, status, router]);

  // Handle search with debouncing
  useEffect(() => {
    if (status === 'loading' || !session) return;
    
    const timeoutId = setTimeout(() => {
      fetchInvoices(1, searchTerm, statusFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle status filter changes
  useEffect(() => {
    if (status === 'loading' || !session) return;
    fetchInvoices(1, searchTerm, statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    if (invoicesLoaded && customersLoaded) {
      setLoading(false);
    }
  }, [invoicesLoaded, customersLoaded]);

  const fetchInvoices = async (page: number = 1, search: string = '', status: string = 'all') => {
    try {
      setSearchLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status !== 'all' && { status })
      });
      
      const response = await fetch(`/api/invoices?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched invoices:', data.invoices);
        console.log('Pagination info:', data.pagination);
        setInvoices(data.invoices || []);
        setPagination(data.pagination || null);
        setCurrentPage(page);
        
        // Auto-clear search term after successful search (optional)
        // Uncomment the lines below if you want to auto-clear the search
        // if (search && data.invoices && data.invoices.length > 0) {
        //   setTimeout(() => {
        //     setSearchTerm('');
        //   }, 2000); // Clear after 2 seconds
        // }
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

  const fetchAllInvoices = async () => {
    try {
      const response = await fetch('/api/invoices?limit=1000'); // Get all invoices for stats
      if (response.ok) {
        const data = await response.json();
        setAllInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error('Error fetching all invoices:', error);
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
        fetchInvoices(currentPage, searchTerm, statusFilter);
        fetchAllInvoices(); // Refresh stats
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
        fetchInvoices(currentPage, searchTerm, statusFilter);
        fetchAllInvoices(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      // For now, we'll show a toast message since PDF export is not implemented yet
      // TODO: Implement actual PDF generation
      alert('PDF export feature coming soon!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  // Helper function to get customer details
  const getCustomerDetails = (customerId: string) => {
    const customer = customers.find(c => c._id === customerId);
    if (!customer) {
      return { name: 'Unknown Customer', companyName: '', city: 'Unknown City', phone: 'No Phone' };
    }
    return {
      name: customer.name,
      companyName: customer.companyName || '',
      city: customer.address.city,
      phone: customer.phone || 'No Phone'
    };
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchInvoices(page, searchTerm, statusFilter);
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

  // Filter invoices for current year (Year-to-Date)
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1); // January 1st of current year
  
  const yearToDateInvoices = allInvoices.filter(invoice => {
    const invoiceDate = new Date(invoice.createdAt);
    return invoiceDate >= yearStart;
  });

  // Calculate stats from year-to-date data
  const stats = {
    total: yearToDateInvoices.length,
    paid: yearToDateInvoices.filter(i => i.status === 'paid').length,
    pending: yearToDateInvoices.filter(i => i.status === 'sent').length,
    overdue: yearToDateInvoices.filter(i => i.status === 'overdue').length,
    draft: yearToDateInvoices.filter(i => i.status === 'draft').length,
    totalRevenue: yearToDateInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    totalValue: yearToDateInvoices.reduce((sum, i) => sum + i.total, 0),
    // Add dollar amounts for each status
    pendingAmount: yearToDateInvoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0),
    overdueAmount: yearToDateInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0),
    draftAmount: yearToDateInvoices.filter(i => i.status === 'draft').reduce((sum, i) => sum + i.total, 0)
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
              <p className="text-slate-200 text-lg">
                Manage and track all your invoices
              </p>
              <p className="text-sm text-blue-300 mt-2">
                📊 Stats show year-to-date data (Jan 1, {currentYear} - present)
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
          {/* 1. Total Revenue */}
          <AnimatedCard delay={0.1} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Total Revenue</CardTitle>
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
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <p className="text-xs text-green-300">
                All invoices (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          {/* 2. Paid Revenue */}
          <AnimatedCard delay={0.2} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Paid Revenue</CardTitle>
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
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <p className="text-xs text-emerald-300">
                From paid invoices (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          {/* 3. Overdue */}
          <AnimatedCard delay={0.3} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Overdue</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                {stats.overdue}
              </motion.div>
              <p className="text-xs text-red-300">
                ${stats.overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} past due (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          {/* 4. Draft */}
          <AnimatedCard delay={0.4} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-400">Draft</CardTitle>
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
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {stats.draft}
              </motion.div>
              <p className="text-xs text-yellow-300">
                ${stats.draftAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in progress (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          {/* 5. Pending */}
          <AnimatedCard delay={0.5} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">Pending</CardTitle>
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
              <p className="text-xs text-blue-300">
                ${stats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} awaiting payment (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          {/* 6. Total Invoices */}
          <AnimatedCard delay={0.6} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-400">Total Invoices</CardTitle>
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
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                {stats.total}
              </motion.div>
              <p className="text-xs text-purple-300">
                Year-to-date
              </p>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Search and Filter Section */}
        <AnimatedCard delay={0.8} className="gradient-card mb-8">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center">
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
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by invoice number, customer name, or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full placeholder:text-blue-300 text-slate-200"
                />
              </div>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    fetchInvoices(1, '', statusFilter);
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Clear
                </Button>
              )}
            </div>
            
            {/* Status Filter Tabs */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300 hover:text-white">All</TabsTrigger>
                <TabsTrigger value="draft" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-slate-300 hover:text-white">Draft</TabsTrigger>
                <TabsTrigger value="sent" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300 hover:text-white">Sent</TabsTrigger>
                <TabsTrigger value="paid" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-slate-300 hover:text-white">Paid</TabsTrigger>
                <TabsTrigger value="overdue" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-slate-300 hover:text-white">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </AnimatedCard>

        {/* Invoices List */}
        <AnimatedCard delay={0.9} className="gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="gradient-text">Invoice List</CardTitle>
                <CardDescription>
                  {pagination ? `${pagination.totalCount} total invoices` : 'Loading...'}
                </CardDescription>
              </div>
              {searchTerm && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-300">
                    Search results for: "{searchTerm}"
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      fetchInvoices(1, '', statusFilter);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">
                  {searchTerm ? 'No invoices found' : 'No invoices yet'}
                </h3>
                <p className="text-slate-300 mb-4">
                  {searchTerm 
                    ? `No invoices match your search for "${searchTerm}"`
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
                      Create Invoice
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice, index) => {
                  const customerDetails = getCustomerDetails(invoice.customerId);
                  return (
                    <motion.div 
                      key={invoice._id} 
                      className="flex items-center justify-between p-6 border rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 dark:hover:from-red-900/20 dark:hover:to-blue-900/20 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-center space-x-6">
                        <motion.div 
                          className="p-3 bg-gradient-to-br from-red-100 to-blue-100 rounded-lg"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <FileText className="h-6 w-6 text-red-600" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                          <div className="space-y-2 mt-1">
                            {/* Customer Information */}
                            <div className="flex items-center space-x-4 text-sm text-slate-200">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1 text-blue-400" />
                                {customerDetails.name}
                                {customerDetails.companyName && (
                                  <span className="ml-1 text-blue-300">({customerDetails.companyName})</span>
                                )}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1 text-green-400" />
                                {customerDetails.phone}
                              </div>
                              <div className="flex items-center">
                                <span className="text-orange-400">📍</span>
                                {customerDetails.city}
                              </div>
                            </div>
                            {/* Invoice Dates */}
                            <div className="flex items-center space-x-4 text-sm text-slate-300">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-purple-400" />
                                {new Date(invoice.issueDate).toLocaleDateString()}
                              </div>
                              {invoice.dueDate && (
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-red-400" />
                                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-bold text-xl gradient-text">
                            ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <Badge 
                          className={
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {invoice.status}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/invoices/${invoice._id}`)}
                              title="View Invoice"
                              className="hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/invoices/${invoice._id}/edit`)}
                              title="Edit Invoice"
                              className="hover:bg-green-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadPDF(invoice._id)}
                              title="Download PDF"
                              className="hover:bg-purple-100"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <Select onValueChange={(value) => handleUpdateStatus(invoice._id, value)}>
                            <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-blue-500 hover:text-blue-400 hover:border-blue-400 transition-colors duration-200 [&>span]:text-blue-500 [&>span]:font-semibold">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="draft" className="text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200 font-medium">Draft</SelectItem>
                              <SelectItem value="sent" className="text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 font-medium">Sent</SelectItem>
                              <SelectItem value="paid" className="text-green-300 hover:bg-green-500/20 hover:text-green-200 font-medium">Paid</SelectItem>
                              <SelectItem value="overdue" className="text-red-300 hover:bg-red-500/20 hover:text-red-200 font-medium">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteInvoice(invoice._id)}
                              title="Delete Invoice"
                              className="hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <AnimatedCard delay={1.0} className="gradient-card mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-200">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} invoices
                </div>
                <div className="flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={!pagination.hasPrevPage}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  </motion.div>
                  <span className="text-sm text-slate-200">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!pagination.hasNextPage}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
}