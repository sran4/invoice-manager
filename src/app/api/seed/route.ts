import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import Customer from "@/lib/db/models/Customer";
import Invoice from "@/lib/db/models/Invoice";
import WorkDescription from "@/lib/db/models/WorkDescription";
import bcrypt from "bcryptjs";

// Sample data arrays (same as seed script)
const sampleNames = [
  "John Smith",
  "Sarah Johnson",
  "Michael Brown",
  "Emily Davis",
  "David Wilson",
  "Lisa Anderson",
  "Robert Taylor",
  "Jennifer Thomas",
  "William Jackson",
  "Mary White",
  "James Harris",
  "Patricia Martin",
  "Christopher Garcia",
  "Linda Martinez",
  "Daniel Robinson",
  "Barbara Clark",
  "Matthew Rodriguez",
  "Elizabeth Lewis",
  "Anthony Lee",
  "Jennifer Walker",
  "Mark Hall",
  "Nancy Allen",
  "Donald Young",
  "Sandra King",
  "Steven Wright",
  "Donna Lopez",
  "Paul Hill",
  "Carol Green",
  "Andrew Adams",
  "Ruth Nelson",
];

const sampleCompanies = [
  "Acme Corporation",
  "Tech Solutions Inc",
  "Global Services LLC",
  "Innovation Labs",
  "Premier Consulting",
  "Elite Business Group",
  "Advanced Systems",
  "Creative Solutions",
  "Professional Services Co",
  "Strategic Partners",
  "Dynamic Enterprises",
  "Excellence Corp",
  "Prime Technologies",
  "Superior Solutions",
  "Optimal Services",
  "Peak Performance",
  "Summit Business",
  "Vertex Industries",
  "Nexus Corporation",
  "Fusion Enterprises",
];

const sampleCities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
  "Boston",
  "El Paso",
  "Nashville",
  "Detroit",
  "Oklahoma City",
  "Portland",
  "Las Vegas",
  "Memphis",
  "Louisville",
];

const sampleStates = [
  "NY",
  "CA",
  "IL",
  "TX",
  "AZ",
  "PA",
  "FL",
  "OH",
  "NC",
  "WA",
  "CO",
  "DC",
  "MA",
  "TN",
  "MI",
  "OK",
  "OR",
  "NV",
  "KY",
  "IN",
  "UT",
  "CT",
  "SC",
  "AL",
];

const sampleStreets = [
  "123 Main St",
  "456 Oak Ave",
  "789 Pine Rd",
  "321 Elm St",
  "654 Maple Dr",
  "987 Cedar Ln",
  "147 Birch Way",
  "258 Spruce St",
  "369 Willow Ave",
  "741 Poplar Rd",
  "852 Ash St",
  "963 Hickory Ln",
  "159 Cherry Dr",
  "357 Walnut Ave",
  "468 Chestnut St",
];

const sampleWorkDescriptions = [
  "Web Development Services",
  "Graphic Design",
  "Consulting Services",
  "Marketing Strategy",
  "Software Development",
  "Project Management",
  "Data Analysis",
  "Content Creation",
  "Social Media Management",
  "SEO Optimization",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "Business Analysis",
  "Technical Writing",
  "Quality Assurance",
  "System Administration",
  "Database Management",
  "Cloud Services",
  "E-commerce Solutions",
];

const sampleInvoiceItems = [
  { description: "Web Development", rate: 150 },
  { description: "Graphic Design", rate: 100 },
  { description: "Consulting", rate: 200 },
  { description: "Project Management", rate: 120 },
  { description: "Software Development", rate: 180 },
  { description: "Marketing Services", rate: 90 },
  { description: "Content Creation", rate: 75 },
  { description: "SEO Services", rate: 110 },
  { description: "Mobile Development", rate: 160 },
  { description: "UI/UX Design", rate: 130 },
];

const templates = ["modern", "classic", "minimal", "professional", "creative"];

// Helper functions
const getRandomItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generatePhoneNumber = () => {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode}) ${exchange}-${number}`;
};

const generateEmail = (name: string) => {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "company.com",
  ];
  const cleanName = name.toLowerCase().replace(/\s+/g, ".");
  return `${cleanName}@${getRandomItem(domains)}`;
};

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const number = Math.floor(Math.random() * 10000) + 1;
  return `INV-${year}${month}-${String(number).padStart(4, "0")}`;
};

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Seeding is only allowed in development" },
        { status: 403 }
      );
    }

    const {
      clear = true,
      userCount = 3,
      customerCount = 20,
      invoiceCount = 50,
    } = await request.json();

    await connectDB();

    if (clear) {
      // Clear existing data
      await User.deleteMany({});
      await Customer.deleteMany({});
      await Invoice.deleteMany({});
      await WorkDescription.deleteMany({});
    }

    // Create users
    const users = [];
    for (let i = 0; i < userCount; i++) {
      const name = getRandomItem(sampleNames);
      const email = generateEmail(name);
      const hashedPassword = await bcrypt.hash("password123", 12);

      const user = new User({
        email,
        name,
        password: hashedPassword,
        companySettings: {
          name: getRandomItem(sampleCompanies),
          email: email,
          phone: generatePhoneNumber(),
          website: `https://www.${getRandomItem(sampleCompanies)
            .toLowerCase()
            .replace(/\s+/g, "")}.com`,
          address: {
            street: getRandomItem(sampleStreets),
            city: getRandomItem(sampleCities),
            state: getRandomItem(sampleStates),
            zipCode: String(Math.floor(Math.random() * 90000) + 10000),
            country: "USA",
          },
          taxId: `TAX-${Math.floor(Math.random() * 900000000) + 100000000}`,
        },
        preferences: {
          theme: getRandomItem(["light", "dark", "auto"]),
          notifications: {
            email: true,
            browser: true,
            invoiceReminders: true,
            paymentReminders: true,
          },
          invoiceDefaults: {
            dueDays: getRandomItem([15, 30, 45, 60]),
            taxRate: getRandomItem([7.5, 8.25, 9.0, 10.0]),
            currency: "USD",
            template: getRandomItem(templates),
          },
        },
      });

      users.push(user);
    }

    await User.insertMany(users);

    // Create customers
    const customers = [];
    for (let i = 0; i < customerCount; i++) {
      const user = getRandomItem(users);
      const name = getRandomItem(sampleNames);
      const hasCompany = Math.random() > 0.3;

      const customer = new Customer({
        userId: user._id.toString(),
        name,
        email: generateEmail(name),
        phone: generatePhoneNumber(),
        fax: Math.random() > 0.7 ? generatePhoneNumber() : undefined,
        companyName: hasCompany ? getRandomItem(sampleCompanies) : undefined,
        address: {
          street: getRandomItem(sampleStreets),
          city: getRandomItem(sampleCities),
          state: getRandomItem(sampleStates),
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          country: "USA",
        },
      });

      customers.push(customer);
    }

    await Customer.insertMany(customers);

    // Create work descriptions
    const workDescriptions = [];
    for (let i = 0; i < 15; i++) {
      const user = getRandomItem(users);
      const workItem = getRandomItem(sampleWorkDescriptions);

      const workDescription = new WorkDescription({
        userId: user._id.toString(),
        title: workItem,
        description: `Professional ${workItem.toLowerCase()} with high-quality deliverables and excellent customer service.`,
        rate: Math.floor(Math.random() * 200) + 50,
      });

      workDescriptions.push(workDescription);
    }

    await WorkDescription.insertMany(workDescriptions);

    // Create invoices
    const invoices = [];
    const statuses = ["draft", "sent", "paid", "overdue"];
    const statusWeights = [0.2, 0.3, 0.4, 0.1];

    for (let i = 0; i < invoiceCount; i++) {
      const user = getRandomItem(users);
      const customer = getRandomItem(customers);

      const random = Math.random();
      let status = "draft";
      let cumulativeWeight = 0;
      for (let j = 0; j < statuses.length; j++) {
        cumulativeWeight += statusWeights[j];
        if (random <= cumulativeWeight) {
          status = statuses[j];
          break;
        }
      }

      const itemCount = Math.floor(Math.random() * 5) + 1;
      const selectedItems = getRandomItems(sampleInvoiceItems, itemCount);

      const items = selectedItems.map((item, index) => ({
        id: `item-${index + 1}`,
        description: item.description,
        quantity: Math.floor(Math.random() * 10) + 1,
        rate: item.rate + Math.floor(Math.random() * 50) - 25,
        amount: 0,
      }));

      items.forEach((item) => {
        item.amount = item.quantity * item.rate;
      });

      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      const taxRate = user.preferences?.invoiceDefaults?.taxRate || 8.25;
      const tax = subtotal * (taxRate / 100);
      const discount = Math.random() > 0.8 ? subtotal * 0.1 : 0;
      const total = subtotal + tax - discount;

      const issueDate = generateRandomDate(
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        new Date()
      );

      const dueDate =
        status === "draft"
          ? undefined
          : new Date(
              issueDate.getTime() +
                (user.preferences?.invoiceDefaults?.dueDays || 30) *
                  24 *
                  60 *
                  60 *
                  1000
            );

      const invoice = new Invoice({
        userId: user._id.toString(),
        invoiceNumber: generateInvoiceNumber(),
        customerId: customer._id.toString(),
        items,
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        total: Math.round(total * 100) / 100,
        issueDate,
        dueDate,
        status,
        notes: Math.random() > 0.7 ? "Thank you for your business!" : undefined,
        template: getRandomItem(templates),
        companyName: user.companySettings?.name,
      });

      invoices.push(invoice);
    }

    await Invoice.insertMany(invoices);

    // Return sample login credentials
    const loginCredentials = users.map((user, index) => ({
      email: user.email,
      password: "password123",
    }));

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      summary: {
        users: users.length,
        customers: customers.length,
        workDescriptions: workDescriptions.length,
        invoices: invoices.length,
      },
      loginCredentials,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
