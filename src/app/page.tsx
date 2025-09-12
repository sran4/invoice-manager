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
  X,
  Calendar,
  DollarSign,
  BarChart3,
  Filter,
  TrendingUp,
  Smartphone
} from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';

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
      description: 'Choose from 5 beautiful, modern invoice templates with customizable themes and colors.',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Store unlimited customers with detailed analytics, payment history, and performance tracking.',
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Add your company logo, customize colors, and maintain consistent branding across all invoices.',
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Generate professional PDF invoices with template-specific colors and company branding.',
    },
    {
      icon: Zap,
      title: 'Auto Calculations',
      description: 'Automatic tax calculations, discounts, and totals with real-time updates and accuracy.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with user authentication, data encryption, and private storage.',
    },
    {
      icon: Calendar,
      title: 'Overdue Tracking',
      description: 'Automatically track overdue invoices, send reminders, and manage payment collections.',
    },
    {
      icon: DollarSign,
      title: 'Revenue Analytics',
      description: 'Comprehensive yearly revenue tracking, monthly trends, and business performance insights.',
    },
    {
      icon: BarChart3,
      title: 'Customer Analytics',
      description: 'Detailed per-customer analytics with payment patterns, reliability scores, and revenue contribution.',
    },
    {
      icon: Filter,
      title: 'Advanced Filtering',
      description: 'Filter invoices by customer, status, date range, and amount for precise business insights.',
    },
    {
      icon: TrendingUp,
      title: 'Business Reports',
      description: 'Generate comprehensive reports including tax summaries, payment analysis, and growth metrics.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design that works perfectly on desktop, tablet, and mobile devices.',
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

  const faqData = [
    {
      question: "How do I create my first invoice?",
      answer: "Simply sign up for a free account, go to the 'Create Invoice' page, select a template, add your customer information, and fill in the invoice details. Our system will automatically calculate totals, taxes, and discounts for you."
    },
    {
      question: "Can I customize the invoice templates?",
      answer: "Yes! We offer 5 beautiful templates (Modern Blue, Classic Green, Minimal Purple, Professional Gray, and Creative Orange) that you can choose from. Each template has its own color scheme and styling that will be reflected in your PDF exports."
    },
    {
      question: "How do I export invoices as PDF?",
      answer: "Once you've created an invoice, you can download it as a professional PDF by clicking the 'Download PDF' button. The PDF will automatically use your selected template colors and include your company information from settings."
    },
    {
      question: "How does yearly tracking work?",
      answer: "Our system automatically tracks all your invoices throughout the year. You can view yearly summaries, revenue trends, and performance analytics. The dashboard shows monthly breakdowns, quarterly reports, and annual totals to help you understand your business growth over time."
    },
    {
      question: "Can I track invoice statuses like overdue, sent, and paid?",
      answer: "Absolutely! Our system provides comprehensive status tracking: Draft (being created), Sent (delivered to client), Paid (payment received), and Overdue (past due date). You can filter invoices by status, set up automatic reminders for overdue invoices, and track your cash flow in real-time."
    },
    {
      question: "Can I see graphs and analytics per customer?",
      answer: "Yes! Each customer has their own detailed analytics page showing payment history, total amount invoiced, average payment time, and visual charts. You can see which customers pay on time, identify your most valuable clients, and track customer-specific trends over time."
    },
    {
      question: "What kind of business reports can I generate?",
      answer: "You can generate comprehensive reports including: Monthly/Yearly revenue reports, Customer payment analysis, Invoice status summaries, Tax reports, Overdue invoice lists, and Custom date range reports. All reports can be exported as PDFs for your records."
    },
    {
      question: "How do I manage overdue invoices?",
      answer: "The system automatically marks invoices as overdue when they pass their due date. You can view all overdue invoices in a dedicated section, send reminder emails, update payment status, and track which customers consistently pay late. This helps you improve your cash flow management."
    },
    {
      question: "Can I see my business performance over time?",
      answer: "Yes! The dashboard provides detailed analytics including: Revenue trends by month/quarter/year, Invoice volume statistics, Payment success rates, Customer growth metrics, and Comparative performance charts. These insights help you make informed business decisions."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard security measures including user authentication, data encryption, and secure database storage. Each user has their own isolated system, so your data is completely private."
    },
    {
      question: "Can I manage multiple customers?",
      answer: "Yes! You can add unlimited customers to your database. Each customer's information is stored securely and can be quickly selected when creating new invoices. You can also view the invoice history for each customer."
    },
    {
      question: "What payment methods do you support?",
      answer: "Our invoice system is designed to work with any payment method. You can include payment instructions, bank details, or payment links in your invoices. We focus on creating professional invoices that you can send to clients via email or print."
    },
    {
      question: "Can I set up automatic invoice reminders?",
      answer: "Yes! You can configure automatic reminders for overdue invoices. The system can send email reminders at customizable intervals (e.g., 7 days, 14 days, 30 days after due date) to help you collect payments faster and maintain good customer relationships."
    },
    {
      question: "How do I track my best customers?",
      answer: "The customer analytics section shows you detailed insights about each client including: Total amount invoiced, Average payment time, Number of invoices, Payment reliability score, and Revenue contribution. This helps you identify and nurture your most valuable relationships."
    },
    {
      question: "Is there a mobile app?",
      answer: "Our web application is fully responsive and works perfectly on mobile devices, tablets, and desktops. You can access all features from any device with an internet connection - no separate app installation required."
    },
    {
      question: "How much does it cost?",
      answer: "Our invoice management system is completely free to use! You can create unlimited invoices, manage unlimited customers, and access all features without any cost or subscription fees."
    },
    {
      question: "Can I backup my data?",
      answer: "Your data is automatically backed up and stored securely in our database. You can also export your invoices as PDFs for your own records. We recommend keeping copies of important invoices for your business records."
    }
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
              className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Design beautiful, professional invoices with our modern templates. 
              Track overdue payments, analyze revenue trends, filter by customers, 
              and gain powerful business insights with comprehensive analytics.
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
              Complete Business Solution
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Advanced features for professional invoicing, customer management, and business analytics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses using our comprehensive invoice management system with advanced analytics, overdue tracking, and customer insights
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg">
                  Start Your Free Account
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

      {/* FAQ Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Everything you need to know about our invoice management system
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion 
              items={faqData} 
              className="max-w-3xl mx-auto"
              allowMultiple={true}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}