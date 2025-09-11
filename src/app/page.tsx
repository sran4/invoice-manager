'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Palette, 
  Download, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  const handlePreviewTemplate = (template: any) => {
    console.log('Preview template clicked:', template);
    setPreviewTemplate(template);
  };

  const features = [
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from 5 beautiful, modern invoice templates with customizable themes.',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Store and manage customer information for quick invoice creation.',
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Add your company logo and customize colors to match your brand.',
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Generate professional PDF invoices ready for printing or emailing.',
    },
    {
      icon: Zap,
      title: 'Auto Calculations',
      description: 'Automatic tax calculations, discounts, and totals for accurate billing.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is secure with user authentication and private storage.',
    },
  ];

  const templates = [
    {
      id: 'modern-blue',
      name: 'Modern Blue',
      description: 'Clean and professional with a modern blue gradient theme',
      gradient: 'from-blue-500 to-cyan-500',
      popular: true,
    },
    {
      id: 'classic-green',
      name: 'Classic Green',
      description: 'Traditional business layout with professional green accents',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'minimal-purple',
      name: 'Minimal Purple',
      description: 'Simple and elegant design with purple gradient highlights',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-purple-500/10 dark:from-red-500/20 dark:via-blue-500/20 dark:to-purple-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 gradient-text dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Create Professional Invoices
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Design beautiful, professional invoices with our modern templates. 
              Manage customers, track payments, and grow your business.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signup">
                  <Button size="lg" className="gradient-button text-white border-0 px-8 py-6 text-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-6 text-lg">
                    View Templates
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Powerful features to streamline your invoicing process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AnimatedCard className="gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader>
                      <motion.div 
                        className="w-12 h-12 gradient-red-blue rounded-lg flex items-center justify-center mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-slate-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="py-24 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text dark:text-white mb-4">
              Beautiful Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Choose from our collection of professionally designed templates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <AnimatedCard className="gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader>
                    <motion.div 
                      className={`w-full h-32 bg-gradient-to-r ${template.gradient} rounded-lg flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FileText className="h-12 w-12 text-white" />
                      </motion.div>
                    </motion.div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-slate-300">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePreviewTemplate(template);
                        }}
                      >
                        Preview Template
                      </Button>
                    </motion.div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 gradient-red-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses already using our invoice management system
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg">
                  Create Your First Invoice
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogTitle className="gradient-text text-2xl">
                {previewTemplate?.name} - Template Preview
              </DialogTitle>
            </motion.div>
          </DialogHeader>
          
          {previewTemplate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Sample Invoice Preview */}
              <motion.div 
                className={`bg-gradient-to-r ${previewTemplate.gradient} p-8 rounded-lg text-white mb-6 shadow-2xl`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex justify-between items-start mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
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
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
                  <p className="text-white/90">Client Company Name</p>
                  <p className="text-white/80">456 Client Avenue</p>
                  <p className="text-white/80">Client City, State 67890</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
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
                  <motion.div 
                    className="grid grid-cols-4 gap-4 text-sm"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
                  >
                    <div className="col-span-3 text-right font-medium">Total:</div>
                    <div className="text-right font-bold text-lg">$1,000.00</div>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex justify-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <motion.div whileHover={{ rotate: -5 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    onClick={() => setPreviewTemplate(null)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    Close Preview
                  </Button>
                </motion.div>
                <motion.div whileHover={{ rotate: 5 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="gradient-button text-white border-0 pulse-glow"
                    onClick={() => {
                      setPreviewTemplate(null);
                      router.push('/templates');
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Choose This Template
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}