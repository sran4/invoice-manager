import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/connection";
import Invoice from "@/lib/db/models/Invoice";
import Customer from "@/lib/db/models/Customer";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("dateRange") || "this-year"; // Default to year-to-date
    const customerIds =
      searchParams.get("customers")?.split(",").filter(Boolean) || [];

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    switch (dateRange) {
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last-month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "this-year":
        startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
        break;
      default:
        startDate = new Date(now.getFullYear(), 0, 1); // Default to year-to-date
    }

    // Build query
    const query: Record<string, unknown> = {
      userId: session.user.email,
      issueDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (customerIds.length > 0) {
      query.customerId = { $in: customerIds };
    }

    // Fetch invoices
    const invoices = await Invoice.find(query).lean();

    // Fetch customers for mapping
    const customers = await Customer.find({
      userId: session.user.email,
    }).lean();
    const customerMap = new Map(customers.map((c) => [c._id.toString(), c]));

    // Calculate analytics data
    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "paid"
    );
    const sentInvoices = invoices.filter(
      (invoice) => invoice.status === "sent"
    );
    const overdueInvoices = invoices.filter(
      (invoice) => invoice.status === "overdue"
    );
    const draftInvoices = invoices.filter(
      (invoice) => invoice.status === "draft"
    );

    // For revenue calculation, include paid, sent, and overdue invoices
    const revenueInvoices = invoices.filter((invoice) =>
      ["paid", "sent", "overdue"].includes(invoice.status)
    );

    const totalRevenue = revenueInvoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );

    // Revenue by customer with Revenue vs Outstanding metrics
    const revenueByCustomerMap = new Map();
    invoices.forEach((invoice) => {
      const customerId = invoice.customerId;
      const customer = customerMap.get(customerId);
      const customerName = customer ? customer.name : "Unknown Customer";

      if (!revenueByCustomerMap.has(customerId)) {
        revenueByCustomerMap.set(customerId, {
          customerId,
          customerName,
          revenue: 0, // Total revenue (all invoices)
          outstanding: 0, // Outstanding revenue (sent + overdue invoices)
        });
      }

      const existing = revenueByCustomerMap.get(customerId);
      existing.revenue += invoice.total;

      // Only count sent and overdue invoices as outstanding
      if (["sent", "overdue"].includes(invoice.status)) {
        existing.outstanding += invoice.total;
      }
    });

    const revenueByCustomer = Array.from(revenueByCustomerMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    );

    // Revenue by month
    const revenueByMonthMap = new Map();
    revenueInvoices.forEach((invoice) => {
      const month = new Date(invoice.issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });

      if (!revenueByMonthMap.has(month)) {
        revenueByMonthMap.set(month, {
          month,
          revenue: 0,
          invoiceCount: 0,
        });
      }

      const existing = revenueByMonthMap.get(month);
      existing.revenue += invoice.total;
      existing.invoiceCount += 1;
    });

    const revenueByMonth = Array.from(revenueByMonthMap.values()).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    // Revenue by status
    const revenueByStatusMap = new Map();
    invoices.forEach((invoice) => {
      const status = invoice.status;

      if (!revenueByStatusMap.has(status)) {
        revenueByStatusMap.set(status, {
          status,
          revenue: 0,
          count: 0,
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
        total: invoices.length,
      },
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
