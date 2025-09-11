'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  fax?: string;
  createdAt: string;
}

export default function CustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchCustomers();
  }, [session, status, router]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCustomers(customers.filter(c => c._id !== customerId));
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
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
    <div className="pt-20 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2 float-animation">Customers</h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Manage your customer database and contact information
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className="gradient-button text-white border-0" 
                onClick={() => router.push('/customers/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{customers.length}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {filteredCustomers.length} shown
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm ? 'No customers found' : 'No customers yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-center">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start building your customer database by adding your first customer'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/customers/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Customer
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer._id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>
                        Added {new Date(customer.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/customers/${customer._id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{customer.phone}</span>
                  </div>
                  
                  {customer.fax && (
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>Fax: {customer.fax}</span>
                    </div>
                  )}
                  
                  <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <div>{customer.address.street}</div>
                      <div>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/invoices/create?customer=${customer._id}`)}
                    >
                      Create Invoice
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
