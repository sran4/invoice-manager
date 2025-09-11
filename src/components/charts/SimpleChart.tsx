'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleChartProps {
  title: string;
  description: string;
  data?: any[];
}

export default function SimpleChart({ title, description, data }: SimpleChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-text">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-gray-500">
          {data && data.length > 0 ? (
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Chart Ready</p>
              <p className="text-sm">Data available: {data.length} items</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">No Data</p>
              <p className="text-sm">Create some invoices to see charts</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
