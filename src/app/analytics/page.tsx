"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard } from "@/components/ui/animated-card";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Download,
  RefreshCw,
  Filter,
  FileText,
  ArrowLeft,
} from "lucide-react";
import RevenueDonutChart from "@/components/charts/RevenueDonutChart";
import RevenueLineChart from "@/components/charts/RevenueLineChart";
import CustomerShippingBarChart from "@/components/charts/CustomerShippingBarChart";
import DateRangePicker from "@/components/ui/date-range-picker";
import CustomerMultiSelect from "@/components/ui/customer-multi-select";

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
  status: "draft" | "sent" | "paid" | "overdue";
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
    outstanding: number;
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
  invoiceStatusBreakdown: {
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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("this-year"); // Default to year-to-date
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchAnalyticsData();
    fetchCustomers();
  }, [session, status, router, dateRange, selectedCustomers]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics?dateRange=${dateRange}&customers=${selectedCustomers.join(
          ","
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        const errorData = await response.json();
        console.error("Analytics API error:", errorData);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleDateRangeChange = (newDateRange: string) => {
    setDateRange(newDateRange);
  };

  const handleCustomerSelectionChange = (newSelectedCustomers: string[]) => {
    setSelectedCustomers(newSelectedCustomers);
  };

  const handleExport = async (
    type: "chart-data" | "full-details" | "summary"
  ) => {
    try {
      const response = await fetch(
        `/api/analytics/export?type=${type}&dateRange=${dateRange}&customers=${selectedCustomers.join(
          ","
        )}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${type}-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const currentYear = new Date().getFullYear();

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
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2 float-animation">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Track your sales revenue with interactive charts and detailed
            reports
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            📊 Default view shows year-to-date data (Jan 1, {currentYear} -
            present)
          </p>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters (25%) */}
          <div className="lg:col-span-1">
            <AnimatedCard delay={0.1} className="gradient-card">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-blue-500" />
                  <CardTitle className="gradient-text">
                    Filters & Controls
                  </CardTitle>
                </div>
                <CardDescription>Customize your analytics view</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </h3>
                  <DateRangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </div>

                {/* Customer Filter */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Customers
                  </h3>
                  <CustomerMultiSelect
                    customers={customers}
                    selectedCustomers={selectedCustomers}
                    onSelectionChange={handleCustomerSelectionChange}
                  />
                </div>

                {/* Refresh Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full gradient-button text-white border-0"
                    onClick={fetchAnalyticsData}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh Data
                  </Button>
                </motion.div>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Right Content Area - Charts (75%) */}
          <div className="lg:col-span-3">
            {/* Revenue Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <AnimatedCard delay={0.2} className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
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
                    $
                    {(analyticsData?.totalRevenue || 0).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {dateRange === "this-year"
                      ? `Year-to-date (${currentYear})`
                      : "Selected period"}
                  </p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.3} className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Shipped
                  </CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold gradient-text"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    $
                    {(
                      analyticsData?.revenueByCustomer?.reduce(
                        (sum, customer) => sum + customer.outstanding,
                        0
                      ) || 0
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Amount shipped to customers
                  </p>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.4} className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Customers
                  </CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Users className="h-4 w-4 text-purple-500" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold gradient-text"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    {(analyticsData?.revenueByCustomer || []).length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {customers.length} total customers
                  </p>
                </CardContent>
              </AnimatedCard>
            </div>

            {/* Invoice Status Breakdown */}
            {analyticsData?.invoiceStatusBreakdown && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <AnimatedCard delay={0.5} className="gradient-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Paid
                        </p>
                        <p className="text-2xl font-bold">
                          {analyticsData.invoiceStatusBreakdown.paid}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Paid
                      </Badge>
                    </div>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.6} className="gradient-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Sent
                        </p>
                        <p className="text-2xl font-bold">
                          {analyticsData.invoiceStatusBreakdown.sent}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                    </div>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.7} className="gradient-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">
                          Overdue
                        </p>
                        <p className="text-2xl font-bold">
                          {analyticsData.invoiceStatusBreakdown.overdue}
                        </p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        Overdue
                      </Badge>
                    </div>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.8} className="gradient-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Draft
                        </p>
                        <p className="text-2xl font-bold">
                          {analyticsData.invoiceStatusBreakdown.draft}
                        </p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <AnimatedCard delay={0.6} className="gradient-card">
                <CardHeader>
                  <CardTitle className="gradient-text">
                    Revenue vs Customer Dollar Amount Shipped
                  </CardTitle>
                  <CardDescription>
                    Distribution of revenue across customers showing total
                    amount shipped
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueDonutChart
                    data={analyticsData?.revenueByCustomer || []}
                  />
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.7} className="gradient-card">
                <CardHeader>
                  <CardTitle className="gradient-text">
                    Amount Shipped to Each Customer
                  </CardTitle>
                  <CardDescription>
                    Total dollar amount shipped to each customer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomerShippingBarChart
                    data={analyticsData?.revenueByCustomer || []}
                  />
                </CardContent>
              </AnimatedCard>
            </div>

            <AnimatedCard delay={0.8} className="gradient-card">
              <CardHeader>
                <CardTitle className="gradient-text">
                  Revenue Trends Over Time
                </CardTitle>
                <CardDescription>
                  Monthly revenue progression showing growth patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueLineChart data={analyticsData?.revenueByMonth || []} />
              </CardContent>
            </AnimatedCard>
          </div>
        </div>

        {/* Export Data Section */}
        <AnimatedCard delay={0.9} className="gradient-card mt-8">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-blue-500" />
              <CardTitle className="gradient-text">Export Data</CardTitle>
            </div>
            <CardDescription>
              Download your analytics data in Excel format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full gradient-button text-white border-0"
                  onClick={() => handleExport("chart-data")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Chart Data
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full gradient-button text-white border-0"
                  onClick={() => handleExport("full-details")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Full Details
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full gradient-button text-white border-0"
                  onClick={() => handleExport("summary")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Summary Report
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}
