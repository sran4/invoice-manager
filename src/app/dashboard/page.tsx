'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Phone
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

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [invoicesResponse, customersResponse] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/customers')
      ]);

      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData.invoices || []);
      }

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Calculate real stats from actual data
  const stats = {
    totalInvoices: invoices.length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    pendingInvoices: invoices.filter(i => i.status === 'sent').length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
    draftInvoices: invoices.filter(i => i.status === 'draft').length,
    overdueInvoices: invoices.filter(i => i.status === 'overdue').length
  };

  // Helper function to get customer details
  const getCustomerDetails = (customerId: string) => {
    const customer = customers.find(c => c._id === customerId);
    if (!customer) {
      return { name: 'Unknown Customer', city: 'Unknown City', phone: 'No Phone' };
    }
    return {
      name: customer.name,
      city: customer.address.city,
      phone: customer.phone || 'No Phone'
    };
  };

  // Get recent invoices (last 5)
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(invoice => {
      const customerDetails = getCustomerDetails(invoice.customerId);
      return {
        id: invoice.invoiceNumber,
        customer: customerDetails.name,
        city: customerDetails.city,
        phone: customerDetails.phone,
        amount: invoice.total,
        status: invoice.status,
        date: new Date(invoice.createdAt).toLocaleDateString(),
        dueDate: invoice.dueDate,
        _id: invoice._id
      };
    });

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
          <h1 className="text-4xl font-bold gradient-text mb-2 float-animation">
            Welcome back, {session.user?.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Manage your invoices, customers, and grow your business
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard delay={0.1} className="gradient-card cursor-pointer group">
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

          <AnimatedCard delay={0.2} className="gradient-card cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Users className="h-6 w-6 text-blue-600" />
                </motion.div>
                <Badge variant="outline" className="border-blue-300 text-blue-600">Manage</Badge>
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

          <AnimatedCard delay={0.3} className="gradient-card cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FileText className="h-6 w-6 text-purple-600" />
                </motion.div>
                <Badge variant="outline" className="border-purple-300 text-purple-600">Templates</Badge>
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
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard delay={0.4} className="gradient-card">
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
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                {stats.totalInvoices}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                {stats.draftInvoices} draft, {stats.paidInvoices} paid
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.5} className="gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
              <p className="text-xs text-muted-foreground">
                From {stats.paidInvoices} paid invoices
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.6} className="gradient-card">
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
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                {stats.pendingInvoices}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.7} className="gradient-card">
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
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              >
                {stats.draftInvoices}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Recent Invoices */}
        <AnimatedCard delay={0.8} className="gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="gradient-text">Recent Invoices</CardTitle>
                <CardDescription>
                  Your latest invoice activity
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
                recentInvoices.map((invoice, index) => (
                  <motion.div 
                    key={invoice._id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="p-2 bg-gradient-to-br from-red-100 to-blue-100 rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FileText className="h-5 w-5 text-red-600" />
                      </motion.div>
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {invoice.customer}, {invoice.city}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {invoice.phone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'No due date'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium gradient-text">${invoice.amount.toLocaleString()}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{invoice.date}</p>
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
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}
