'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface WorkDescriptionFormData {
  title: string;
  description: string;
  rate: number;
}

export default function NewWorkDescriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WorkDescriptionFormData>({
    title: '',
    description: '',
    rate: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/work-descriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Work description created successfully!');
        // Check if we should return to a specific page
        const returnTo = searchParams.get('returnTo');
        if (returnTo) {
          router.push(`/${returnTo}`);
        } else {
          router.push('/work-descriptions');
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create work description');
      }
    } catch (error) {
      console.error('Error creating work description:', error);
      toast.error('Failed to create work description');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
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
    <div className="min-h-screen bg-gradient-to-r from-slate-700 via-slate-800 via-slate-900 to-black p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-700/8 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-slate-800/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-2xl bg-gradient-to-r from-slate-800/20 via-slate-700/15 to-slate-600/10 rounded-3xl p-6 border border-white/10 dark:border-slate-700/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => {
                  const returnTo = searchParams.get('returnTo');
                  if (returnTo) {
                    router.push(`/${returnTo}`);
                  } else {
                    router.back();
                  }
                }}
                className="p-2 text-white hover:text-blue-400 hover:bg-white/10 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-bounce">
                  Add Work Description
                </h1>
                <p className="text-slate-200 text-lg">
                  Create a reusable work description for your invoices
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={loading ? 'cursor-not-allowed' : ''}>
          <Card className="backdrop-blur-2xl bg-gradient-to-r from-slate-800/20 via-slate-700/15 to-slate-600/10 border border-white/10 dark:border-slate-700/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="h-5 w-5 mr-2 text-blue-400" />
                Work Description Details
              </CardTitle>
              <CardDescription className="text-slate-300">
                Create a detailed description that you can reuse across multiple invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="title" className="text-white">Title *</Label>
                  <span className="text-xs text-slate-400">
                    {formData.title.length}/50
                  </span>
                </div>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 50) {
                      handleInputChange('title', value);
                    }
                  }}
                  placeholder="e.g., Web Development, Consulting, Design Services"
                  required
                  maxLength={50}
                  className="bg-white/10 dark:bg-slate-700/20 border-white/20 dark:border-slate-600/20 text-white placeholder:text-slate-400 focus:ring-blue-400 focus:border-blue-400 backdrop-blur-sm transition-all duration-300"
                />
                {formData.title.length > 45 && (
                  <p className="text-xs text-amber-400">
                    ⚠️ Approaching character limit for clean invoice printing
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <span className="text-xs text-slate-400">
                    {formData.description.length}/200
                  </span>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 200) {
                      handleInputChange('description', value);
                    }
                  }}
                  placeholder="Provide a detailed description of the work or service..."
                  required
                  rows={6}
                  maxLength={200}
                  className="bg-white/10 dark:bg-slate-700/20 border-white/20 dark:border-slate-600/20 text-white placeholder:text-slate-400 focus:ring-blue-400 focus:border-blue-400 backdrop-blur-sm transition-all duration-300"
                />
                {formData.description.length > 180 && (
                  <p className="text-xs text-amber-400">
                    ⚠️ Approaching character limit for clean invoice printing
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate" className="text-white">Hourly Rate (Optional)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.rate === 0 ? '' : formData.rate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handleInputChange('rate', 0);
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        handleInputChange('rate', numValue);
                      }
                    }
                  }}
                  placeholder="0.00"
                  className="bg-white/10 dark:bg-slate-700/20 border-white/20 dark:border-slate-600/20 text-white placeholder:text-slate-400 focus:ring-blue-400 focus:border-blue-400 backdrop-blur-sm transition-all duration-300"
                />
                <p className="text-sm text-slate-300">
                  Set a default hourly rate for this work description. You can override this when creating invoices.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const returnTo = searchParams.get('returnTo');
                if (returnTo) {
                  router.push(`/${returnTo}`);
                } else {
                  router.back();
                }
              }}
              disabled={loading}
              className="border-white/20 dark:border-slate-600/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-400 hover:via-purple-400 hover:to-cyan-400 text-white border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer transform"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-white">Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Description
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
