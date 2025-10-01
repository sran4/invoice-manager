"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RevenueByCustomer {
  customerId: string;
  customerName: string;
  revenue: number;
  outstanding: number;
}

interface RevenueDonutChartProps {
  data: RevenueByCustomer[];
  title?: string;
  description?: string;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
  "#00ffff",
  "#ffff00",
  "#ff0000",
  "#0000ff",
  "#800080",
  "#008000",
  "#ffa500",
  "#ff69b4",
  "#40e0d0",
];

export default function RevenueDonutChart({
  data,
  title = "Revenue vs Outstanding by Customer",
  description = "Distribution of revenue versus outstanding amounts across customers",
}: RevenueDonutChartProps) {
  // Transform data for the chart
  const chartData = (data || []).map((item, index) => ({
    name: item.customerName || "Unknown Customer",
    value: item.revenue || 0,
    outstanding: item.outstanding || 0,
    fill: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { name: string; value: number; outstanding: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Revenue:{" "}
            <span className="font-semibold text-green-600">
              $
              {data.value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Outstanding:{" "}
            <span className="font-semibold text-amber-600">
              $
              {data.outstanding.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({
    payload,
  }: {
    payload?: Array<{ value: string; color: string }>;
  }) => {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {payload &&
          payload.map((entry, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {entry.value}
              </span>
            </div>
          ))}
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">
                No revenue data available
              </div>
              <div className="text-sm">
                Create and mark invoices as paid to see revenue analytics
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total revenue for center display
  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-text">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center total revenue display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                $
                {totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Revenue
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2">
          {chartData.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="truncate max-w-[120px]">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  $
                  {item.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  Outstanding: $
                  {item.outstanding.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          ))}
          {chartData.length > 5 && (
            <div className="text-xs text-gray-500 text-center mt-2">
              +{chartData.length - 5} more customers
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
