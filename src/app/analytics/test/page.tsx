"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalyticsTest() {
  const [testResults, setTestResults] = useState<
    Record<
      string,
      {
        status: number | string;
        success: boolean;
        data?: unknown;
        error?: string;
        contentType?: string | null;
      }
    >
  >({});

  const testAPI = async (endpoint: string, name: string) => {
    try {
      console.log(`Testing ${name}...`);
      const response = await fetch(endpoint);

      // Check if it's an export endpoint (returns binary data)
      if (endpoint.includes("/export")) {
        const blob = await response.blob();
        setTestResults((prev) => ({
          ...prev,
          [name]: {
            status: response.status,
            success: response.ok,
            data: `Binary file received (${blob.size} bytes)`,
            contentType: response.headers.get("content-type"),
          },
        }));
        console.log(`${name} result:`, {
          status: response.status,
          size: blob.size,
        });
      } else {
        const data = await response.json();
        setTestResults((prev) => ({
          ...prev,
          [name]: {
            status: response.status,
            success: response.ok,
            data: data,
          },
        }));
        console.log(`${name} result:`, { status: response.status, data });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setTestResults((prev) => ({
        ...prev,
        [name]: {
          status: "error",
          success: false,
          error: errorMessage,
        },
      }));
      console.error(`${name} error:`, error);
    }
  };

  const runAllTests = async () => {
    setTestResults({});
    await testAPI("/api/customers", "Customers API");
    await testAPI("/api/analytics?dateRange=this-month", "Analytics API");
    await testAPI(
      "/api/analytics/export?type=summary&dateRange=this-month",
      "Export API"
    );
  };

  const testExport = async (type: string) => {
    try {
      const response = await fetch(
        `/api/analytics/export?type=${type}&dateRange=this-month`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `test-${type}-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert(`${type} export downloaded successfully!`);
      } else {
        alert(`Export failed: ${response.status}`);
      }
    } catch (error) {
      alert(`Export error: ${error.message}`);
    }
  };

  return (
    <div className="pt-20 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Analytics Functionality Test
        </h1>

        <div className="mb-6 space-y-4">
          <Button
            onClick={runAllTests}
            className="gradient-button text-white border-0"
          >
            Run All Tests
          </Button>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test Export Downloads:</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => testExport("chart-data")}
                variant="outline"
              >
                Test Chart Data Export
              </Button>
              <Button
                onClick={() => testExport("full-details")}
                variant="outline"
              >
                Test Full Details Export
              </Button>
              <Button onClick={() => testExport("summary")} variant="outline">
                Test Summary Export
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(testResults).map(([name, result]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle
                  className={`${
                    result.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {name} - {result.success ? "SUCCESS" : "FAILED"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Status:</strong> {result.status}
                  </p>
                  {result.data && (
                    <div>
                      <strong>Data:</strong>
                      <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {result.error && (
                    <p className="text-red-600">
                      <strong>Error:</strong> {result.error}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {Object.keys(testResults).length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">
                Click &quot;Run All Tests&quot; to test the analytics
                functionality
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
