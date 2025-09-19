# Database Seeding Script

This script populates your database with realistic fake data for testing the invoice management application.

## What it creates:

- **5 Users** with complete company settings and preferences
- **50 Customers** with realistic contact information and addresses
- **30 Work Descriptions** with various services and rates
- **100 Invoices** with different statuses (draft, sent, paid, overdue)

## Features:

- ✅ **Realistic Data**: Uses real-looking names, companies, addresses, and phone numbers
- ✅ **Proper Relationships**: Invoices are linked to customers and users correctly
- ✅ **Varied Statuses**: Invoices have realistic status distributions (20% draft, 30% sent, 40% paid, 10% overdue)
- ✅ **Complete Settings**: Users have company settings, preferences, and invoice defaults
- ✅ **Random Dates**: Invoices span the last year with realistic issue and due dates
- ✅ **Calculated Totals**: Invoice amounts are properly calculated with tax and discounts

## Usage:

### Install dependencies first:

```bash
npm install
```

### Run the seed script:

```bash
npm run seed
```

### For development (keeps existing data):

```bash
npm run seed:dev
```

## Sample Login Credentials:

After running the seed script, you'll see sample login credentials like:

```
🔑 Sample login credentials:
   1. Email: john.smith@gmail.com | Password: password123
   2. Email: sarah.johnson@yahoo.com | Password: password123
   3. Email: michael.brown@hotmail.com | Password: password123
   4. Email: emily.davis@outlook.com | Password: password123
   5. Email: david.wilson@company.com | Password: password123
```

## What you can test:

1. **Dashboard**: View revenue stats, recent invoices, and quick actions
2. **Customer Management**: Browse paginated customer list, search, and manage customers
3. **Invoice Management**: View paginated invoices, filter by status, search functionality
4. **Invoice Creation**: Create new invoices with pre-populated customer data
5. **PDF Export**: Generate and download invoice PDFs
6. **Analytics**: View charts and reports with realistic data
7. **Settings**: Manage company settings and user preferences

## Data Distribution:

- **Invoice Statuses**:

  - 20% Draft (being created)
  - 30% Sent (delivered to client)
  - 40% Paid (payment received)
  - 10% Overdue (past due date)

- **Geographic Distribution**: Customers spread across major US cities
- **Company Types**: Mix of corporations, LLCs, and individual customers
- **Service Types**: Various professional services with realistic rates

## Customization:

You can modify the seed script to:

- Change the number of records created
- Add more sample data arrays
- Adjust the status distribution
- Add more realistic business scenarios

## Safety:

- The script clears existing data by default
- Use `npm run seed:dev` to keep existing data
- Always backup your database before running in production
- The script is designed for development and testing only

## Troubleshooting:

If you encounter issues:

1. Make sure your database connection is working
2. Ensure all dependencies are installed (`npm install`)
3. Check that your MongoDB is running
4. Verify your environment variables are set correctly

Happy testing! 🚀
