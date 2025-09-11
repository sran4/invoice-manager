'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Search, X, ChevronDown } from 'lucide-react';

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

interface CustomerMultiSelectProps {
  customers: Customer[];
  selectedCustomers: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
}

export default function CustomerMultiSelect({ 
  customers, 
  selectedCustomers, 
  onSelectionChange,
  placeholder = "Select customers..."
}: CustomerMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const handleCustomerToggle = (customerId: string) => {
    const newSelection = selectedCustomers.includes(customerId)
      ? selectedCustomers.filter(id => id !== customerId)
      : [...selectedCustomers, customerId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    onSelectionChange(filteredCustomers.map(c => c._id));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleRemoveCustomer = (customerId: string) => {
    onSelectionChange(selectedCustomers.filter(id => id !== customerId));
  };

  const getSelectedCustomers = () => {
    return customers.filter(c => selectedCustomers.includes(c._id));
  };

  const selectedCustomersData = getSelectedCustomers();

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between min-h-[40px] h-auto"
      >
        <div className="flex items-center flex-wrap gap-1 flex-1">
          {selectedCustomersData.length === 0 ? (
            <span className="text-gray-500 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {placeholder}
            </span>
          ) : (
            <div className="flex items-center flex-wrap gap-1">
              {selectedCustomersData.slice(0, 2).map((customer) => (
                <Badge
                  key={customer._id}
                  variant="secondary"
                  className="text-xs"
                >
                  {customer.name}
                </Badge>
              ))}
              {selectedCustomersData.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedCustomersData.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Selected Customers Display */}
      {selectedCustomersData.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCustomersData.map((customer) => (
            <Badge
              key={customer._id}
              variant="secondary"
              className="text-xs pr-1"
            >
              {customer.name}
              <button
                onClick={() => handleRemoveCustomer(customer._id)}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-[9999] shadow-xl max-h-80 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Select Customers</span>
              <span className="text-xs text-gray-500">
                {selectedCustomers.length} selected
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Search and select customers to filter analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex-1"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="flex-1"
              >
                Clear All
              </Button>
            </div>

            {/* Customer List */}
            <div className="max-h-52 overflow-y-auto pr-2 space-y-1">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No customers found
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer._id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                    onClick={() => handleCustomerToggle(customer._id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer._id)}
                      onChange={() => handleCustomerToggle(customer._id)}
                      className="rounded border-gray-300 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">{customer.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-1">{customer.email}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                        {customer.address.city}, {customer.address.state}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
