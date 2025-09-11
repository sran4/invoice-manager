'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';

interface WorkDescription {
  _id: string;
  title: string;
  description: string;
  rate: number;
  createdAt: string;
}

export default function WorkDescriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workDescriptions, setWorkDescriptions] = useState<WorkDescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchWorkDescriptions();
  }, [session, status, router]);

  const fetchWorkDescriptions = async () => {
    try {
      const response = await fetch('/api/work-descriptions');
      if (response.ok) {
        const data = await response.json();
        setWorkDescriptions(data.workDescriptions || []);
      }
    } catch (error) {
      console.error('Error fetching work descriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkDescription = async (workDescriptionId: string) => {
    if (!confirm('Are you sure you want to delete this work description?')) return;
    
    try {
      const response = await fetch(`/api/work-descriptions/${workDescriptionId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setWorkDescriptions(workDescriptions.filter(w => w._id !== workDescriptionId));
      }
    } catch (error) {
      console.error('Error deleting work description:', error);
    }
  };

  const filteredWorkDescriptions = workDescriptions.filter(workDescription =>
    workDescription.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workDescription.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Work Descriptions</h1>
              <p className="text-slate-600 text-lg">
                Manage your reusable work descriptions and service rates
              </p>
            </div>
            <Button onClick={() => router.push('/work-descriptions/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Description
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Total Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{workDescriptions.length}</div>
              <p className="text-sm text-slate-600">
                {filteredWorkDescriptions.length} shown
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Work Descriptions List */}
        {filteredWorkDescriptions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm ? 'No descriptions found' : 'No work descriptions yet'}
              </h3>
              <p className="text-slate-600 mb-6 text-center">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create reusable work descriptions to speed up your invoice creation'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/work-descriptions/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Description
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkDescriptions.map((workDescription) => (
              <Card key={workDescription._id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{workDescription.title}</CardTitle>
                      <CardDescription>
                        Added {new Date(workDescription.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/work-descriptions/${workDescription._id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteWorkDescription(workDescription._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-slate-600">
                    <p className="line-clamp-3">{workDescription.description}</p>
                  </div>
                  
                  {workDescription.rate > 0 && (
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${workDescription.rate.toFixed(2)}/hour</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/invoices/create?workDescription=${workDescription._id}`)}
                    >
                      Use in Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
