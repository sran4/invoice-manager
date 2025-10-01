"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Database,
  Users,
  FileText,
  User,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    loginCredentials: Array<{ email: string; password: string }>;
    message?: string;
    summary?: {
      users: number;
      customers: number;
      invoices: number;
      workDescriptions: number;
    };
  } | null>(null);
  const [clearData, setClearData] = useState(true);
  const [userCount, setUserCount] = useState(3);
  const [customerCount, setCustomerCount] = useState(20);
  const [invoiceCount, setInvoiceCount] = useState(50);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clear: clearData,
          userCount,
          customerCount,
          invoiceCount,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSeedResult(result);
        toast.success("Database seeded successfully!");
      } else {
        toast.error(result.error || "Failed to seed database");
      }
    } catch (error) {
      console.error("Seeding error:", error);
      toast.error("Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="pt-20 p-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Database Seeding
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Populate your database with realistic test data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Seeding Configuration
              </CardTitle>
              <CardDescription>
                Configure the amount of test data to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="clear-data"
                  checked={clearData}
                  onCheckedChange={setClearData}
                />
                <Label htmlFor="clear-data">Clear existing data</Label>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-count">Number of Users</Label>
                  <Input
                    id="user-count"
                    type="number"
                    min="1"
                    max="10"
                    value={userCount}
                    onChange={(e) =>
                      setUserCount(parseInt(e.target.value) || 1)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customer-count">Number of Customers</Label>
                  <Input
                    id="customer-count"
                    type="number"
                    min="1"
                    max="100"
                    value={customerCount}
                    onChange={(e) =>
                      setCustomerCount(parseInt(e.target.value) || 1)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="invoice-count">Number of Invoices</Label>
                  <Input
                    id="invoice-count"
                    type="number"
                    min="1"
                    max="200"
                    value={invoiceCount}
                    onChange={(e) =>
                      setInvoiceCount(parseInt(e.target.value) || 1)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="w-full gradient-button text-white border-0"
                >
                  {isSeeding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Seeding Database...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Seed Database
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Seeding Results
              </CardTitle>
              <CardDescription>
                View the results of your database seeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {seedResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">
                        Seeding Completed Successfully!
                      </span>
                    </div>
                  </div>

                  {seedResult.summary && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {seedResult.summary.users}
                          </div>
                          <div className="text-sm text-blue-600">Users</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <User className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {seedResult.summary.customers}
                          </div>
                          <div className="text-sm text-green-600">
                            Customers
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <FileText className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {seedResult.summary.invoices}
                          </div>
                          <div className="text-sm text-purple-600">
                            Invoices
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Database className="h-8 w-8 text-orange-600" />
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {seedResult.summary.workDescriptions}
                          </div>
                          <div className="text-sm text-orange-600">
                            Work Items
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">
                      Sample Login Credentials:
                    </h3>
                    <div className="space-y-2">
                      {seedResult.loginCredentials.map(
                        (cred, index: number) => (
                          <div
                            key={index}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="text-sm font-mono">
                              <div>Email: {cred.email}</div>
                              <div>Password: {cred.password}</div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-300">
                    No seeding results yet. Click &quot;Seed Database&quot; to
                    generate test data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    Development Only
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    This seeding feature is only available in development mode.
                    It will not work in production environments for security
                    reasons.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
