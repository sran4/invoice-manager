'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  FileText, 
  Palette, 
  Eye,
  Check,
  Sparkles,
  Zap,
  Crown,
  Star
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';
  preview: string;
  features: string[];
  icon: any;
  gradient: string;
  popular?: boolean;
}

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const templates: Template[] = [
    {
      id: 'modern-blue',
      name: 'Modern Blue',
      description: 'Clean and professional with a modern blue gradient theme',
      category: 'modern',
      preview: 'modern-blue-preview.jpg',
      features: ['Responsive Design', 'Auto Calculations', 'PDF Export', 'Custom Branding'],
      icon: Sparkles,
      gradient: 'from-blue-500 to-cyan-500',
      popular: true,
    },
    {
      id: 'classic-green',
      name: 'Classic Green',
      description: 'Traditional business layout with professional green accents',
      category: 'classic',
      preview: 'classic-green-preview.jpg',
      features: ['Professional Layout', 'Easy Customization', 'Print Ready', 'Tax Calculations'],
      icon: FileText,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'minimal-purple',
      name: 'Minimal Purple',
      description: 'Simple and elegant design with purple gradient highlights',
      category: 'minimal',
      preview: 'minimal-purple-preview.jpg',
      features: ['Clean Design', 'Fast Loading', 'Mobile Optimized', 'Simple Setup'],
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'professional-gray',
      name: 'Professional Gray',
      description: 'Corporate-style template with sophisticated gray tones',
      category: 'professional',
      preview: 'professional-gray-preview.jpg',
      features: ['Corporate Design', 'Advanced Features', 'Multi-language', 'Bulk Operations'],
      icon: Crown,
      gradient: 'from-gray-600 to-slate-600',
    },
    {
      id: 'creative-orange',
      name: 'Creative Orange',
      description: 'Vibrant and creative design perfect for creative professionals',
      category: 'creative',
      preview: 'creative-orange-preview.jpg',
      features: ['Creative Layout', 'Color Customization', 'Portfolio Ready', 'Social Integration'],
      icon: Star,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Store selected template in localStorage
    localStorage.setItem('selectedTemplate', templateId);
    
    // Show success message
    toast.success(`Selected ${templates.find(t => t.id === templateId)?.name} template!`);
    
    // Navigate to invoice creation
    router.push('/invoices/create');
  };

  const handlePreviewTemplate = (template: Template) => {
    console.log('Opening preview for template:', template.name);
    setPreviewTemplate(template);
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
    <div className="min-h-screen pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Choose Your Invoice Template
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select from our collection of professionally designed templates. 
            Each template is fully customizable and optimized for all devices.
          </p>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <AnimatedCard 
                  className={`gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-red-500 shadow-xl scale-105' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 gradient-red-blue rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {template.popular && (
                        <Badge className="bg-orange-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {template.name}
                    </CardTitle>
                    
                    <Badge variant="outline" className="w-fit">
                      {template.category}
                    </Badge>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-slate-300 mb-4">
                      {template.description}
                    </CardDescription>

                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-slate-300 mb-2">
                        Features:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewTemplate(template);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      
                      <Button 
                        size="sm" 
                        className={`flex-1 text-white border-0 ${
                          isSelected 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                            : 'gradient-button'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(template.id);
                        }}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Select
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedTemplate && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              size="lg"
              className="gradient-button text-white border-0 px-8 py-6 text-lg"
              onClick={() => router.push('/invoices/create')}
            >
              Continue with Selected Template
            </Button>
          </motion.div>
        )}
      </div>

      {/* Template Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl">
              {previewTemplate?.name} - Template Preview
            </DialogTitle>
            <DialogDescription>
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="mt-6">
              {/* Sample Invoice Preview */}
              <div className={`bg-gradient-to-r ${previewTemplate.gradient} p-8 rounded-lg text-white mb-6 shadow-2xl`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Your Company Name</h2>
                    <p className="text-white/80">123 Business Street</p>
                    <p className="text-white/80">City, State 12345</p>
                    <p className="text-white/80">your@email.com</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                    <p className="text-white/80">#INV-1001</p>
                    <p className="text-white/80">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
                  <p className="text-white/90">Client Company Name</p>
                  <p className="text-white/80">456 Client Avenue</p>
                  <p className="text-white/80">Client City, State 67890</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium mb-4 pb-2 border-b border-white/20">
                    <div>Description</div>
                    <div className="text-right">Qty</div>
                    <div className="text-right">Rate</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                    <div>Professional Services</div>
                    <div className="text-right">1</div>
                    <div className="text-right">$1,000.00</div>
                    <div className="text-right">$1,000.00</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="col-span-3 text-right font-medium">Total:</div>
                    <div className="text-right font-bold text-lg">$1,000.00</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewTemplate(null)}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Close Preview
                </Button>
                <Button 
                  className="gradient-button text-white border-0"
                  onClick={() => {
                    setPreviewTemplate(null);
                    handleSelectTemplate(previewTemplate.id);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Choose This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}