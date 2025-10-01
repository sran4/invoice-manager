import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/connection";
import Invoice from "@/lib/db/models/Invoice";
import Customer from "@/lib/db/models/Customer";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get("type") || "chart-data";
    const dateRange = searchParams.get("dateRange") || "this-month";
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
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Build query
    const query: Record<string, unknown> = {
      userId: session.user.email,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (customerIds.length > 0) {
      query.customerId = { $in: customerIds };
    }

    // Fetch data
    const invoices = await Invoice.find(query).lean();
    const customers = await Customer.find({
      userId: session.user.email,
    }).lean();
    const customerMap = new Map(customers.map((c) => [c._id.toString(), c]));

    const workbook = XLSX.utils.book_new();

    switch (exportType) {
      case "chart-data":
        // Export chart data
        const chartData = {
          "Revenue by Customer": invoices
            .filter((invoice) => invoice.status === "paid")
            .reduce((acc, invoice) => {
              const customer = customerMap.get(invoice.customerId);
              const customerName = customer
                ? customer.name
                : "Unknown Customer";
              if (!acc[customerName]) {
                acc[customerName] = { revenue: 0, invoiceCount: 0 };
              }
              acc[customerName].revenue += invoice.total;
              acc[customerName].invoiceCount += 1;
              return acc;
            }, {} as Record<string, { revenue: number; invoiceCount: number }>),

          "Revenue by Month": invoices
            .filter((invoice) => invoice.status === "paid")
            .reduce((acc, invoice) => {
              const month = new Date(invoice.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                }
              );
              if (!acc[month]) {
                acc[month] = { revenue: 0, invoiceCount: 0 };
              }
              acc[month].revenue += invoice.total;
              acc[month].invoiceCount += 1;
              return acc;
            }, {} as Record<string, { revenue: number; invoiceCount: number }>),
        };

        // Create worksheets for each chart type
        Object.entries(chartData).forEach(([sheetName, data]) => {
          const worksheetData = Object.entries(data).map(([key, value]) => ({
            [sheetName.includes("Customer") ? "Customer" : "Month"]: key,
            Revenue: value.revenue,
            "Invoice Count": value.invoiceCount,
          }));

          const worksheet = XLSX.utils.json_to_sheet(worksheetData);
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });
        break;

      case "full-details":
        // Export full invoice details
        const fullDetailsData = invoices.map((invoice) => {
          const customer = customerMap.get(invoice.customerId);
          return {
            "Invoice Number": invoice.invoiceNumber,
            "Customer Name": customer ? customer.name : "Unknown Customer",
            "Customer Email": customer ? customer.email : "",
            "Issue Date": new Date(invoice.issueDate).toLocaleDateString(),
            "Due Date": invoice.dueDate
              ? new Date(invoice.dueDate).toLocaleDateString()
              : "",
            Status: invoice.status,
            Subtotal: invoice.subtotal,
            Tax: invoice.tax,
            Discount: invoice.discount,
            Total: invoice.total,
            "Items Count": invoice.items.length,
            "Created At": new Date(invoice.createdAt).toLocaleDateString(),
          };
        });

        const fullDetailsWorksheet = XLSX.utils.json_to_sheet(fullDetailsData);
        XLSX.utils.book_append_sheet(
          workbook,
          fullDetailsWorksheet,
          "Invoice Details"
        );
        break;

      case "summary":
        // Export summary report
        const totalRevenue = invoices
          .filter((invoice) => invoice.status === "paid")
          .reduce((sum, invoice) => sum + invoice.total, 0);

        const summaryData = [
          { Metric: "Total Revenue", Value: totalRevenue },
          { Metric: "Total Invoices", Value: invoices.length },
          {
            Metric: "Paid Invoices",
            Value: invoices.filter((i) => i.status === "paid").length,
          },
          {
            Metric: "Pending Invoices",
            Value: invoices.filter((i) => i.status === "sent").length,
          },
          {
            Metric: "Draft Invoices",
            Value: invoices.filter((i) => i.status === "draft").length,
          },
          {
            Metric: "Overdue Invoices",
            Value: invoices.filter((i) => i.status === "overdue").length,
          },
          {
            Metric: "Unique Customers",
            Value: new Set(invoices.map((i) => i.customerId)).size,
          },
          {
            Metric: "Date Range",
            Value: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          },
        ];

        const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(
          workbook,
          summaryWorksheet,
          "Summary Report"
        );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid export type" },
          { status: 400 }
        );
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="analytics-${exportType}-${
          new Date().toISOString().split("T")[0]
        }.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
