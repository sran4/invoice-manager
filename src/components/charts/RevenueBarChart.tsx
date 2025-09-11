'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueByMonth {
  month: string;
  revenue: number;
  invoiceCount: number;
}

interface RevenueBarChartProps {
  data: RevenueByMonth[];
  title?: string;
  description?: string;
}

export default function RevenueBarChart({ 
  data, 
  title = "Monthly Revenue Breakdown",
  description = "Revenue distribution by month"
}: RevenueBarChartProps) {
  // Transform data for the chart
  const chartData = data.map(item => ({
    month: item.month,
    revenue: item.revenue,
    invoices: item.invoiceCount
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'revenue' ? 'Revenue' : 'Invoices'}: 
              <span className="font-semibold ml-1">
                {entry.dataKey === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-text">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
              <Bar 
                dataKey="invoices" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Invoice Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">
              ${Math.max(...chartData.map(item => item.revenue)).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Peak Month</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">
              ${Math.round(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Average</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <p className="text-lg font-bold text-purple-600">
              {chartData.length}
            </p>
            <p className="text-xs text-gray-600">Months</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
