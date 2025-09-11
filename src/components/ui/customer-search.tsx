'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

interface CustomerSearchProps {
  customers: Customer[];
  selectedCustomerId: string;
  onCustomerSelect: (customerId: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomerSearch({
  customers,
  selectedCustomerId,
  onCustomerSelect,
  placeholder = "Search customers...",
  className = ""
}: CustomerSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsFocused(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleCustomerSelect = (customerId: string) => {
    onCustomerSelect(customerId);
    setIsExpanded(false);
    setIsFocused(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onCustomerSelect('');
    setSearchTerm('');
  };

  const handleMouseEnter = () => {
    if (!isFocused) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isFocused) {
      setIsExpanded(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Input/Display */}
      <div className="relative">
        {selectedCustomer ? (
          // Show selected customer
          <div className="flex items-center justify-between p-3 border border-slate-600 rounded-lg bg-slate-800 hover:border-slate-500 transition-colors">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-slate-300" />
              <div>
                <p className="font-medium text-white">{selectedCustomer.name}</p>
                <p className="text-sm text-slate-300">{selectedCustomer.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="h-8 w-8 p-0 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
              <Search className="h-4 w-4 text-slate-300" />
            </div>
          </div>
        ) : (
          // Show search input
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setIsExpanded(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                // Don't close immediately, let the click outside handler handle it
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="pr-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-300" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredCustomers.length > 0 ? (
              <div className="py-1">
                {filteredCustomers.map((customer) => (
                  <motion.button
                    key={customer._id}
                    type="button"
                    onClick={() => handleCustomerSelect(customer._id)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 focus:bg-slate-700 focus:outline-none transition-colors"
                    whileHover={{ backgroundColor: '#374151' }}
                    whileTap={{ backgroundColor: '#4b5563' }}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-slate-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{customer.name}</p>
                        <p className="text-sm text-slate-300 truncate">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-xs text-slate-400 truncate">{customer.phone}</p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-slate-300">
                {searchTerm ? 'No customers found' : 'Start typing to search customers...'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
