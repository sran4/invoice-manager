"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomerShippingData {
  customerId: string;
  customerName: string;
  revenue: number;
  outstanding: number;
}

interface CustomerShippingBarChartProps {
  data: CustomerShippingData[];
  title?: string;
  description?: string;
}

export default function CustomerShippingBarChart({
  data,
  title = "Revenue vs Outstanding by Customer",
  description = "Total revenue versus outstanding amounts owed by each customer",
}: CustomerShippingBarChartProps) {
  // Transform data for the chart
  const chartData = (data || []).map((item) => ({
    customer: item.customerName || "Unknown Customer",
    outstanding: item.outstanding || 0,
    revenue: item.revenue || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === "outstanding" ? "Outstanding" : "Revenue"}:
              <span className="font-semibold ml-1">
                $
                {entry.value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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
            No revenue data available
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
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="customer"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
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
                dataKey="outstanding"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                name="Outstanding"
              />
              <Bar
                dataKey="revenue"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
            <p className="text-lg font-bold text-amber-600">
              $
              {Math.max(
                ...chartData.map((item) => item.outstanding)
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-600">Highest Outstanding</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">
              $
              {Math.round(
                chartData.reduce((sum, item) => sum + item.outstanding, 0) /
                  chartData.length
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-600">Average Outstanding</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <p className="text-lg font-bold text-purple-600">
              {chartData.length}
            </p>
            <p className="text-xs text-gray-600">Customers</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
