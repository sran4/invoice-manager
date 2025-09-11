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
  BarChart3, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Download,
  RefreshCw,
  Filter,
  FileText
} from 'lucide-react';
import RevenueDonutChart from '@/components/charts/RevenueDonutChart';
import RevenueLineChart from '@/components/charts/RevenueLineChart';
import RevenueBarChart from '@/components/charts/RevenueBarChart';
import DateRangePicker from '@/components/ui/date-range-picker';
import CustomerMultiSelect from '@/components/ui/customer-multi-select';

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

interface AnalyticsData {
  totalRevenue: number;
  revenueByCustomer: Array<{
    customerId: string;
    customerName: string;
    revenue: number;
    invoiceCount: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    invoiceCount: number;
  }>;
  revenueByStatus: Array<{
    status: string;
    revenue: number;
    count: number;
  }>;
  invoiceStatusBreakdown?: {
    paid: number;
    sent: number;
    overdue: number;
    draft: number;
    total: number;
  };
}

export default function Analytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('this-month');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchAnalyticsData();
    fetchCustomers();
  }, [session, status, router, dateRange, selectedCustomers]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?dateRange=${dateRange}&customers=${selectedCustomers.join(',')}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        const errorData = await response.json();
        console.error('Analytics API error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      } else {
        const errorData = await response.json();
        console.error('Customers API error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleDateRangeChange = (newRange: string) => {
    setDateRange(newRange);
  };

  const handleCustomerSelectionChange = (selectedIds: string[]) => {
    setSelectedCustomers(selectedIds);
  };

  const handleExport = async (type: 'chart-data' | 'full-details' | 'summary') => {
    try {
      const response = await fetch(`/api/analytics/export?type=${type}&dateRange=${dateRange}&customers=${selectedCustomers.join(',')}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        console.error('Export API error:', errorData);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
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
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Track your sales revenue with interactive charts and detailed reports
          </p>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters (25%) */}
          <div className="lg:col-span-1">
            <AnimatedCard delay={0.1} className="gradient-card sticky top-24">
              <CardHeader>
                <CardTitle className="gradient-text flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters & Controls
                </CardTitle>
                <CardDescription>
                  Customize your analytics view
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Range Selection */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </h3>
                  <DateRangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </div>

                {/* Customer Selection */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Customers
                  </h3>
                  <CustomerMultiSelect
                    customers={customers}
                    selectedCustomers={selectedCustomers}
                    onSelectionChange={handleCustomerSelectionChange}
                    placeholder="Select customers..."
                  />
                </div>

                {/* Refresh Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full gradient-button text-white border-0" 
                    onClick={fetchAnalyticsData}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </Button>
                </motion.div>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Right Content Area (75%) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Revenue Overview */}
            {analyticsData ? (
              <>
                <AnimatedCard delay={0.2} className="gradient-card">
                  <CardHeader>
                    <CardTitle className="gradient-text flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Revenue Overview
                    </CardTitle>
                    <CardDescription>
                      Total revenue: ${(analyticsData.totalRevenue || 0).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">
                          ${(analyticsData.totalRevenue || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {(analyticsData.revenueByCustomer || []).length}
                        </p>
                        <p className="text-sm text-gray-600">Active Customers</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">
                          {(analyticsData.revenueByCustomer || []).reduce((sum, c) => sum + c.invoiceCount, 0)}
                        </p>
                        <p className="text-sm text-gray-600">Total Invoices</p>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>

                {/* Invoice Status Breakdown */}
                {analyticsData.invoiceStatusBreakdown && (
                  <AnimatedCard delay={0.25} className="gradient-card">
                    <CardHeader>
                      <CardTitle className="gradient-text flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Invoice Status Breakdown
                      </CardTitle>
                      <CardDescription>
                        Overview of invoice statuses for the selected period
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">
                            {analyticsData.invoiceStatusBreakdown.paid}
                          </div>
                          <div className="text-xs text-gray-600">Paid</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">
                            {analyticsData.invoiceStatusBreakdown.sent}
                          </div>
                          <div className="text-xs text-gray-600">Sent</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
                          <div className="text-xl font-bold text-red-600">
                            {analyticsData.invoiceStatusBreakdown.overdue}
                          </div>
                          <div className="text-xs text-gray-600">Overdue</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg">
                          <div className="text-xl font-bold text-gray-600">
                            {analyticsData.invoiceStatusBreakdown.draft}
                          </div>
                          <div className="text-xs text-gray-600">Draft</div>
                        </div>
                      </div>
                      <div className="mt-4 text-center text-sm text-gray-500">
                        Total Invoices: <span className="font-semibold">{analyticsData.invoiceStatusBreakdown.total}</span>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue by Customer (Donut Chart) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <RevenueDonutChart 
                      data={analyticsData.revenueByCustomer || []}
                      title="Revenue by Customer"
                      description="Distribution of revenue across customers"
                    />
                  </motion.div>

                  {/* Revenue Trend (Line Chart) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <RevenueLineChart 
                      data={analyticsData.revenueByMonth || []}
                      title="Revenue Trend"
                      description="Monthly revenue progression"
                    />
                  </motion.div>
                </div>

                {/* Revenue by Month (Bar Chart) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <RevenueBarChart 
                    data={analyticsData.revenueByMonth || []}
                    title="Monthly Revenue Breakdown"
                    description="Revenue distribution by month"
                  />
                </motion.div>
              </>
            ) : (
              <AnimatedCard delay={0.2} className="gradient-card">
                <CardContent>
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-slate-600 dark:text-slate-300 mb-2">No analytics data available</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Create some invoices to see your analytics
                    </p>
                  </div>
                </CardContent>
              </AnimatedCard>
            )}
          </div>
        </div>

        {/* Export Options - Full Width at Bottom */}
        <AnimatedCard delay={0.6} className="gradient-card mt-8">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download your analytics data in various formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => handleExport('chart-data')}
                className="hover:bg-green-50 hover:border-green-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Chart Data (Excel)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('full-details')}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Full Invoice Details (Excel)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('summary')}
                className="hover:bg-purple-50 hover:border-purple-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Summary Report (Excel)
              </Button>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}
