'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  onCustomDateChange?: (startDate: string, endDate: string) => void;
}

const PRESET_RANGES = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
];

export default function DateRangePicker({ value, onChange, onCustomDateChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
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

  const handlePresetChange = (presetValue: string) => {
    onChange(presetValue);
    setIsOpen(false);
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate && onCustomDateChange) {
      onCustomDateChange(customStartDate, customEndDate);
      onChange('custom');
      setIsOpen(false);
    }
  };

  const getCurrentRangeLabel = () => {
    const preset = PRESET_RANGES.find(p => p.value === value);
    return preset ? preset.label : 'Custom Range';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {getCurrentRangeLabel()}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-[9999] shadow-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Date Range</CardTitle>
            <CardDescription className="text-xs">
              Choose a preset range or set custom dates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preset Ranges */}
            <div>
              <h4 className="text-sm font-medium mb-2">Quick Ranges</h4>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_RANGES.slice(0, -1).map((preset) => (
                  <Button
                    key={preset.value}
                    variant={value === preset.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePresetChange(preset.value)}
                    className={value === preset.value ? 'gradient-button text-white border-0' : ''}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div>
              <h4 className="text-sm font-medium mb-2">Custom Range</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleCustomDateSubmit}
                  disabled={!customStartDate || !customEndDate}
                  className="w-full gradient-button text-white border-0"
                >
                  Apply Custom Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
