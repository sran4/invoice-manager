'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Plus, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Eye,
  Download,
  User,
  Phone,
  BarChart3,
  AlertTriangle,
  Edit,
  Trash2
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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Prevent duplicate data fetching
    if (dataFetchedRef.current) return;
    
    // Debounce the data fetching to prevent rapid API calls
    const timeoutId = setTimeout(() => {
      dataFetchedRef.current = true;
      fetchDashboardData();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch data sequentially to prevent layout shifts from simultaneous loading
      const invoicesResponse = await fetch('/api/invoices?limit=1000');
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData.invoices || []);
      }

      const customersResponse = await fetch('/api/customers');
      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        setCustomers(customersData.customers || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="pt-20 p-6 dashboard-container prevent-layout-shift">
        <div className="max-w-7xl mx-auto">
          {/* Loading Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="gradient-card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="gradient-card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          
          {/* Recent Invoices Skeleton */}
          <div className="gradient-card p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Filter invoices for current year (Year-to-Date)
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1); // January 1st of current year
  
  const yearToDateInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.createdAt);
    return invoiceDate >= yearStart;
  });

  // Calculate real stats from year-to-date data
  const stats = {
    totalInvoices: yearToDateInvoices.length,
    totalRevenue: yearToDateInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    totalRevenueAll: yearToDateInvoices.reduce((sum, i) => sum + i.total, 0),
    pendingInvoices: yearToDateInvoices.filter(i => i.status === 'sent').length,
    pendingAmount: yearToDateInvoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0),
    paidInvoices: yearToDateInvoices.filter(i => i.status === 'paid').length,
    draftInvoices: yearToDateInvoices.filter(i => i.status === 'draft').length,
    draftAmount: yearToDateInvoices.filter(i => i.status === 'draft').reduce((sum, i) => sum + i.total, 0),
    overdueInvoices: yearToDateInvoices.filter(i => i.status === 'overdue').length,
    overdueAmount: yearToDateInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0)
  };

  // Helper function to get customer details
  const getCustomerDetails = (customerId: string) => {
    const customer = customers.find(c => c._id === customerId);
    if (!customer) {
      return { name: 'Unknown Customer', city: 'Unknown City', phone: 'No Phone', companyName: '' };
    }
    return {
      name: customer.name,
      city: customer.address.city,
      phone: customer.phone || 'No Phone',
      companyName: customer.companyName || ''
    };
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      // Fetch invoice and customer data for PDF generation
      const response = await fetch(`/api/invoices/${invoiceId}/export`);
      if (!response.ok) {
        console.error('Failed to fetch invoice data');
        return;
      }

      const data = await response.json();
      const { invoice, customer } = data;

      if (!invoice || !customer) {
        console.error('Invoice or customer data not available');
        return;
      }

      // Import the PDF generation function
      const { generateInvoicePDF, fetchCompanySettings, getDefaultCompanyInfo } = await import('@/lib/pdf-export');
      const companyInfo = await fetchCompanySettings() || getDefaultCompanyInfo();
      await generateInvoicePDF(invoice, customer, companyInfo);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh dashboard data after deletion
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Get recent invoices (last 5) - still show all invoices for recent activity
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="pt-20 p-6 dashboard-container prevent-layout-shift">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8 motion-safe"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2 float-animation">
            Welcome back, {session.user?.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Manage your invoices, customers, and grow your business
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            📊 Dashboard shows year-to-date data (Jan 1, {currentYear} - present)
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard delay={0.1} className="gradient-card cursor-pointer group motion-safe">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-red-100 to-blue-100 rounded-lg group-hover:from-red-200 group-hover:to-blue-200 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Plus className="h-6 w-6 text-red-600" />
                </motion.div>
                <Badge className="gradient-red-blue text-white">New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">Create Invoice</CardTitle>
              <CardDescription className="mb-4">
                Start a new invoice with our modern templates
              </CardDescription>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full gradient-button text-white border-0" onClick={() => router.push('/invoices/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Invoice
                </Button>
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="gradient-card cursor-pointer group motion-safe">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Users className="h-6 w-6 text-blue-600" />
                </motion.div>
                <Badge className="gradient-blue-cyan text-white">Manage</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">Manage Customers</CardTitle>
              <CardDescription className="mb-4">
                Add, edit, and organize your customer database
              </CardDescription>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full gradient-button text-white border-0" onClick={() => router.push('/customers')}>
                  <Users className="h-4 w-4 mr-2" />
                  View Customers
                </Button>
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="gradient-card cursor-pointer group motion-safe">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FileText className="h-6 w-6 text-purple-600" />
                </motion.div>
                <Badge className="gradient-purple-pink text-white">Templates</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">Invoice Templates</CardTitle>
              <CardDescription className="mb-4">
                Choose from 5 beautiful, customizable templates
              </CardDescription>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full gradient-button text-white border-0" onClick={() => router.push('/templates')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
              </motion.div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="gradient-card cursor-pointer group motion-safe">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </motion.div>
                <Badge className="gradient-green-emerald text-white">Analytics</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">Analytics</CardTitle>
              <CardDescription className="mb-4">
                Track sales revenue with interactive charts and reports
              </CardDescription>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full gradient-button text-white border-0" onClick={() => router.push('/analytics')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </motion.div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <AnimatedCard delay={0.5} className="gradient-card motion-safe">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <DollarSign className="h-4 w-4 text-blue-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                ${stats.totalRevenueAll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                From {stats.totalInvoices} invoices (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.6} className="gradient-card motion-safe">
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
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                From {stats.paidInvoices} paid invoices (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.7} className="gradient-card motion-safe">
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
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              >
                {stats.pendingInvoices}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                ${stats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} awaiting payment (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.8} className="gradient-card motion-safe">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
              >
                {stats.draftInvoices}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                ${stats.draftAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in progress (YTD)
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.9} className="gradient-card motion-safe">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
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
                transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
              >
                {stats.overdueInvoices}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                ${stats.overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} overdue (YTD)
              </p>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Recent Invoices */}
        <AnimatedCard delay={1.0} className="gradient-card motion-safe">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="gradient-text">Recent Invoices</CardTitle>
                <CardDescription>
                  Your latest invoice activity (all time)
                </CardDescription>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="gradient-button text-white border-0" onClick={() => router.push('/invoices')}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.length === 0 ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-slate-600 dark:text-slate-300 mb-2">No invoices yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Create your first invoice to get started</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="mt-4 gradient-button text-white border-0" 
                      onClick={() => router.push('/invoices/create')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                recentInvoices.map((invoice, index) => {
                  const customerDetails = getCustomerDetails(invoice.customerId);
                  return (
                  <motion.div 
                    key={invoice._id} 
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 border rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 dark:hover:from-red-900/20 dark:hover:to-blue-900/20 transition-all duration-300 gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    {/* Mobile/Tablet Layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 flex-1">
                      <motion.div 
                        className="p-2 lg:p-3 bg-gradient-to-br from-red-100 to-blue-100 rounded-lg self-start"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base lg:text-lg truncate">{invoice.invoiceNumber}</h3>
                        <div className="space-y-1 lg:space-y-2 mt-1">
                          {/* Customer Information */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-slate-200 space-y-1 sm:space-y-0">
                            <div className="flex items-center truncate">
                              <User className="h-3 w-3 mr-1 text-blue-400 flex-shrink-0" />
                              <span className="truncate">{customerDetails.name}</span>
                              {customerDetails.companyName && (
                                <span className="ml-1 text-blue-300 truncate">({customerDetails.companyName})</span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1 text-green-400 flex-shrink-0" />
                              <span className="truncate">{customerDetails.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-orange-400">📍</span>
                              <span className="ml-1 truncate">{customerDetails.city}</span>
                            </div>
                          </div>
                          {/* Invoice Dates */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-slate-300 space-y-1 sm:space-y-0">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-purple-400 flex-shrink-0" />
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </div>
                            {invoice.dueDate && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-red-400 flex-shrink-0" />
                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Amount, Status, Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-2 xl:space-y-0 xl:space-x-4">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-lg lg:text-xl gradient-text">${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <Badge 
                        className={
                          invoice.status === 'paid' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg' : 
                          invoice.status === 'sent' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg' :
                          invoice.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg' : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-lg'
                        }
                      >
                        {invoice.status}
                      </Badge>
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/invoices/${invoice._id}`)}
                            className="cursor-pointer p-1 hover:bg-transparent"
                          >
                            <Eye className="h-4 w-4 text-blue-400 hover:text-blue-300 transition-colors duration-200" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/invoices/${invoice._id}/edit`)}
                            className="cursor-pointer p-1 hover:bg-transparent"
                          >
                            <Edit className="h-4 w-4 text-green-400 hover:text-green-300 transition-colors duration-200" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadPDF(invoice._id)}
                            className="cursor-pointer p-1 hover:bg-transparent"
                          >
                            <Download className="h-4 w-4 text-purple-400 hover:text-purple-300 transition-colors duration-200" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice._id)}
                            className="cursor-pointer p-1 hover:bg-transparent"
                          >
                            <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300 transition-colors duration-200" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })
              )}
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}