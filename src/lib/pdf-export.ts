import jsPDF from 'jspdf';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  issueDate: string;
  dueDate?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  template: string;
  createdAt: string;
}

interface CompanyInfo {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  taxId?: string;
  logo?: string;
}

// Template configurations for PDF generation
const templateConfigs = {
  'modern-blue': {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    headerGradient: [59, 130, 246], // Blue
    name: 'Modern Blue'
  },
  'classic-green': {
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    headerGradient: [16, 185, 129], // Green
    name: 'Classic Green'
  },
  'minimal-purple': {
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    headerGradient: [139, 92, 246], // Purple
    name: 'Minimal Purple'
  },
  'professional-gray': {
    primaryColor: '#6B7280',
    secondaryColor: '#4B5563',
    headerGradient: [107, 114, 128], // Gray
    name: 'Professional Gray'
  },
  'creative-orange': {
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    headerGradient: [245, 158, 11], // Orange
    name: 'Creative Orange'
  }
};

export const generateInvoicePDF = async (
  invoice: Invoice,
  customer: Customer,
  companyInfo: CompanyInfo
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Get template configuration based on invoice template
  const templateConfig = templateConfigs[invoice.template as keyof typeof templateConfigs] || templateConfigs['modern-blue'];
  
  // Debug log to verify template selection
  console.log(`Generating PDF with template: ${invoice.template} (${templateConfig.name})`);
  
  // Colors based on template
  const primaryColor = templateConfig.primaryColor;
  const secondaryColor = templateConfig.secondaryColor;
  const textColor = '#374151';
  const lightGray = '#F3F4F6';
  
  let yPosition = 20;
  
  // Header with gradient-like effect using template color
  doc.setFillColor(templateConfig.headerGradient[0], templateConfig.headerGradient[1], templateConfig.headerGradient[2]);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Company name (white text on template-colored background)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 20, 25);
  
  // Company details (white text)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(companyInfo.address.street, 20, 35);
  doc.text(`${companyInfo.address.city}, ${companyInfo.address.state} ${companyInfo.address.zipCode}`, 20, 42);
  if (companyInfo.phone) {
    doc.text(`Phone: ${companyInfo.phone}`, 20, 49);
  }
  if (companyInfo.email) {
    doc.text(`Email: ${companyInfo.email}`, 20, 56);
  }
  
  // Invoice title and number
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${invoice.invoiceNumber}`, pageWidth - 20, 35, { align: 'right' });
  
  // Reset text color for rest of document
  doc.setTextColor(textColor);
  
  yPosition = 80;
  
  // Bill To section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(customer.name, 20, yPosition);
  if (customer.companyName) {
    yPosition += 6;
    doc.text(customer.companyName, 20, yPosition);
  }
  yPosition += 6;
  doc.text(customer.address.street, 20, yPosition);
  yPosition += 6;
  doc.text(`${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}`, 20, yPosition);
  if (customer.phone) {
    yPosition += 6;
    doc.text(`Phone: ${customer.phone}`, 20, yPosition);
  }
  if (customer.email) {
    yPosition += 6;
    doc.text(`Email: ${customer.email}`, 20, yPosition);
  }
  
  // Invoice details (right side)
  const rightX = pageWidth - 20;
  yPosition = 80;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Issue Date
  doc.text('Issue Date:', rightX - 60, yPosition);
  doc.text(new Date(invoice.issueDate).toLocaleDateString(), rightX, yPosition, { align: 'right' });
  yPosition += 8;
  
  // Due Date
  if (invoice.dueDate) {
    doc.text('Due Date:', rightX - 60, yPosition);
    doc.text(new Date(invoice.dueDate).toLocaleDateString(), rightX, yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  yPosition = 140;
  
  // Items table header with template color
  doc.setFillColor(templateConfig.headerGradient[0], templateConfig.headerGradient[1], templateConfig.headerGradient[2]);
  doc.rect(20, yPosition - 8, pageWidth - 40, 12, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255); // White text on colored background
  doc.text('Description', 25, yPosition);
  doc.text('Qty', 120, yPosition);
  doc.text('Rate', 140, yPosition);
  doc.text('Amount', pageWidth - 25, yPosition, { align: 'right' });
  doc.setTextColor(textColor); // Reset text color for items
  
  yPosition += 15;
  
  // Items
  doc.setFont('helvetica', 'normal');
  invoice.items.forEach((item, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Item description (with word wrapping)
    const description = item.description;
    const maxWidth = 90;
    const lines = doc.splitTextToSize(description, maxWidth);
    
    doc.text(lines, 25, yPosition);
    
    // Quantity, Rate, Amount
    doc.text(item.quantity.toString(), 120, yPosition);
    doc.text(`$${item.rate.toFixed(2)}`, 140, yPosition);
    doc.text(`$${item.amount.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });
    
    // Move to next line based on description height
    yPosition += Math.max(8, lines.length * 4);
    
    // Add separator line between items
    if (index < invoice.items.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      yPosition += 5;
    }
  });
  
  yPosition += 20;
  
  // Totals section
  const totalsX = pageWidth - 80;
  
  // Subtotal
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPosition);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });
  yPosition += 8;
  
  // Tax
  if (invoice.tax > 0) {
    doc.text('Tax:', totalsX, yPosition);
    doc.text(`$${invoice.tax.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  // Discount
  if (invoice.discount > 0) {
    doc.text('Discount:', totalsX, yPosition);
    doc.text(`-$${invoice.discount.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  // Add extra spacing before total section
  yPosition += 5;
  
  // Total
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  // Use template color for total section background
  doc.setFillColor(templateConfig.headerGradient[0], templateConfig.headerGradient[1], templateConfig.headerGradient[2]);
  doc.rect(totalsX - 5, yPosition - 8, 75, 12, 'F');
  doc.setTextColor(255, 255, 255); // White text on colored background
  doc.text('Total:', totalsX, yPosition);
  doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });
  doc.setTextColor(textColor); // Reset text color
  
  yPosition += 30;
  
  // Notes section
  if (invoice.notes && invoice.notes.trim()) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    const notes = invoice.notes;
    const maxWidth = pageWidth - 40;
    const noteLines = doc.splitTextToSize(notes, maxWidth);
    doc.text(noteLines, 20, yPosition);
  }
  
  // Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  
  // Thank you message (center)
  doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
  
  // Timestamp (bottom right)
  const currentDate = new Date();
  const timestamp = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  doc.text(`Generated: ${timestamp}`, pageWidth - 20, footerY, { align: 'right' });
  
  // Save the PDF
  const fileName = `Invoice-${invoice.invoiceNumber}.pdf`;
  doc.save(fileName);
};

// Re-export the company settings functions
export { fetchCompanySettings, getDefaultCompanyInfo } from './company-settings';
