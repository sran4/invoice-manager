import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import Invoice from '@/lib/db/models/Invoice';
import Customer from '@/lib/db/models/Customer';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'this-month';
    const customerIds = searchParams.get('customers')?.split(',').filter(Boolean) || [];


    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    switch (dateRange) {
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    console.log('Analytics API - Date range:', dateRange);
    console.log('Analytics API - Start date:', startDate.toISOString());
    console.log('Analytics API - End date:', endDate.toISOString());

    // Build query
    const query: any = {
      userId: session.user.email,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (customerIds.length > 0) {
      query.customerId = { $in: customerIds };
    }

    // Fetch invoices
    const invoices = await Invoice.find(query).lean();
    console.log('Analytics API - Query:', JSON.stringify(query, null, 2));
    console.log('Analytics API - Total invoices found:', invoices.length);
    console.log('Analytics API - Invoice details:', invoices.map(inv => ({ 
      id: inv._id, 
      customerId: inv.customerId, 
      status: inv.status, 
      total: inv.total,
      createdAt: inv.createdAt 
    })));

    // Fetch customers for mapping
    const customers = await Customer.find({ userId: session.user.email }).lean();
    const customerMap = new Map(customers.map(c => [c._id.toString(), c]));
    console.log('Analytics API - Customers found:', customers.length);

    // Calculate analytics data
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const sentInvoices = invoices.filter(invoice => invoice.status === 'sent');
    const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');
    const draftInvoices = invoices.filter(invoice => invoice.status === 'draft');
    
    console.log('Analytics API - Invoice status breakdown:');
    console.log('  - Paid invoices:', paidInvoices.length);
    console.log('  - Sent invoices:', sentInvoices.length);
    console.log('  - Overdue invoices:', overdueInvoices.length);
    console.log('  - Draft invoices:', draftInvoices.length);
    
    // For revenue calculation, include paid, sent, and overdue invoices
    const revenueInvoices = invoices.filter(invoice => 
      ['paid', 'sent', 'overdue'].includes(invoice.status)
    );
    
    console.log('Analytics API - Revenue invoices (paid/sent/overdue):', revenueInvoices.length);
    console.log('Analytics API - Revenue invoice details:', revenueInvoices.map(inv => ({ 
      id: inv._id, 
      customerId: inv.customerId, 
      status: inv.status,
      total: inv.total 
    })));
    
    const totalRevenue = revenueInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    console.log('Analytics API - Total revenue calculated:', totalRevenue);

    // Revenue by customer
    const revenueByCustomerMap = new Map();
    revenueInvoices
      .forEach(invoice => {
        const customerId = invoice.customerId;
        const customer = customerMap.get(customerId);
        const customerName = customer ? customer.name : 'Unknown Customer';
        
        console.log(`Processing invoice ${invoice._id} for customer ${customerId} (${customerName})`);
        
        if (!revenueByCustomerMap.has(customerId)) {
          revenueByCustomerMap.set(customerId, {
            customerId,
            customerName,
            revenue: 0,
            invoiceCount: 0
          });
        }
        
        const existing = revenueByCustomerMap.get(customerId);
        existing.revenue += invoice.total;
        existing.invoiceCount += 1;
        
        console.log(`Updated customer ${customerName}: revenue=${existing.revenue}, count=${existing.invoiceCount}`);
      });

    const revenueByCustomer = Array.from(revenueByCustomerMap.values())
      .sort((a, b) => b.revenue - a.revenue);
    
    console.log('Analytics API - Revenue by customer map size:', revenueByCustomerMap.size);
    console.log('Analytics API - Revenue by customer data:', revenueByCustomer);

    // Revenue by month
    const revenueByMonthMap = new Map();
    revenueInvoices
      .forEach(invoice => {
        const month = new Date(invoice.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!revenueByMonthMap.has(month)) {
          revenueByMonthMap.set(month, {
            month,
            revenue: 0,
            invoiceCount: 0
          });
        }
        
        const existing = revenueByMonthMap.get(month);
        existing.revenue += invoice.total;
        existing.invoiceCount += 1;
      });

    const revenueByMonth = Array.from(revenueByMonthMap.values())
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Revenue by status
    const revenueByStatusMap = new Map();
    invoices.forEach(invoice => {
      const status = invoice.status;
      
      if (!revenueByStatusMap.has(status)) {
        revenueByStatusMap.set(status, {
          status,
          revenue: 0,
          count: 0
        });
      }
      
      const existing = revenueByStatusMap.get(status);
      existing.revenue += invoice.total;
      existing.count += 1;
    });

    const revenueByStatus = Array.from(revenueByStatusMap.values());

    const analyticsData = {
      totalRevenue,
      revenueByCustomer,
      revenueByMonth,
      revenueByStatus,
      invoiceStatusBreakdown: {
        paid: paidInvoices.length,
        sent: sentInvoices.length,
        overdue: overdueInvoices.length,
        draft: draftInvoices.length,
        total: invoices.length
      },
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
