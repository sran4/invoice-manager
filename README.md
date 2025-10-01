# 🧾 Enterprise Invoice Management System

A comprehensive, production-ready invoice management platform built with cutting-edge technologies. This system combines enterprise-level security, modern UI/UX design, and powerful automation features to streamline your billing operations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

## ✨ Key Features

### 🎨 **Modern UI/UX Design**

- **Glassmorphism Interface** with gradient themes and premium aesthetics
- **Dark/Light Mode** with smooth transitions and system preference detection
- **Mobile-First Responsive** design optimized for all devices
- **Micro-Animations** powered by Framer Motion for enhanced UX
- **WCAG 2.1 AA Compliant** with keyboard navigation and screen reader support

### 📊 **Business Intelligence & Analytics**

- **Real-time Dashboard** with comprehensive business metrics and KPIs
- **Financial Analytics** tracking revenue trends, payment tracking, and cash flow
- **Customer Insights** with payment patterns and relationship management
- **Interactive Charts** for data visualization (revenue, customers, trends)
- **Performance Metrics** for invoice conversion and payment times

### 🧾 **Professional Invoice Management**

- **5 Premium Templates** (Modern Blue, Classic Green, Minimal Purple, Professional Gray, Creative Orange)
- **Smart PDF Generation** with template-specific branding and auto-formatting
- **Advanced Calculations** for tax, discounts, and multi-currency support
- **Status Tracking** from draft to paid with automated reminders
- **Auto-Numbering** with year-based sequential tracking
- **Smart Due Dates** with configurable payment terms

### 👥 **Customer Relationship Management**

- **Complete CRM** with comprehensive customer profiles
- **Company Information** support for B2B invoicing
- **Smart Search** with filters by name, company, email, and location
- **Customer Analytics** showing invoice history and payment patterns
- **Bulk Operations** for efficient customer management

### 🔐 **Enterprise Security**

- **NextAuth.js** authentication with Google OAuth support
- **Password Security** with strength validation and hashing
- **Rate Limiting** to prevent brute force attacks (5 attempts, 30-min lockout)
- **Session Management** with 30-day refresh tokens
- **Multi-tenant** architecture with complete data isolation
- **CSRF Protection** and secure API endpoints

### 📄 **Advanced PDF Export**

- **High-Quality PDFs** with professional formatting
- **Template Integration** matching your selected invoice design
- **Company Branding** with logo and custom information
- **Optimized Output** for digital and print distribution

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account (free tier available)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sran4/invoice-manager.git
   cd invoice-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` in the root directory:

   ```env
   # Database
   MONGODB_URI=your_mongodb_atlas_connection_string

   # Authentication (generate secret: openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key_here

   # App Configuration
   NEXT_PUBLIC_APP_NAME=Invoice Manager
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Create your account**

   Sign up with your email or use Google OAuth for instant access

## 🗄️ Database Setup

### MongoDB Atlas (Free Tier)

1. **Create cluster** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create database user** with read/write permissions
3. **Whitelist IP** (use `0.0.0.0/0` for development, specific IPs for production)
4. **Get connection string** from Atlas dashboard
5. **Add to `.env.local`** as `MONGODB_URI`

### Database Seeding (Optional)

Generate test data for development:

```bash
# Via API endpoint (requires authentication)
POST http://localhost:3000/api/seed

# Via seed script
npm run seed
```

This creates sample users, customers, invoices, and work descriptions for testing.

## 📁 Project Structure

```
invoice-manager/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                 # API routes & endpoints
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── customers/      # Customer CRUD operations
│   │   │   ├── invoices/       # Invoice management
│   │   │   ├── analytics/      # Analytics & reporting
│   │   │   └── settings/       # User settings
│   │   ├── auth/               # Auth pages (signin/signup)
│   │   ├── dashboard/          # Main dashboard
│   │   ├── invoices/           # Invoice pages
│   │   ├── customers/          # Customer pages
│   │   ├── templates/          # Template selection
│   │   ├── settings/           # Settings page
│   │   └── work-descriptions/  # Reusable work items
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── charts/            # Chart components
│   │   └── layout/            # Layout components
│   ├── lib/                   # Utilities & helpers
│   │   ├── db/               # Database models & connection
│   │   ├── auth/             # Auth configuration
│   │   ├── pdf-export.ts     # PDF generation
│   │   └── utils.ts          # Shared utilities
│   ├── contexts/             # React contexts
│   ├── types/                # TypeScript definitions
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
├── scripts/                  # Database seed scripts
└── README.md
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 18** - UI library with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Framer Motion** - Animation library
- **Lucide Icons** - Beautiful SVG icons

### Backend

- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **NextAuth.js** - Authentication
- **jsPDF** - PDF generation

### Dev Tools

- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform

## 📱 Features Walkthrough

### Creating Your First Invoice

1. **Add a Customer** - Go to Customers → New Customer
2. **Select Template** - Choose from 5 professional templates
3. **Create Invoice** - Fill in details, add line items
4. **Download PDF** - Generate professional PDF instantly
5. **Track Status** - Monitor payment status and send reminders

### Managing Customers

- Create unlimited customer profiles
- Add company information for B2B invoicing
- Search by name, company, or email
- View invoice history per customer
- Track payment patterns and reliability

### Analytics & Reporting

- **Year-to-Date** revenue tracking
- **Monthly trends** with interactive charts
- **Customer analysis** showing top clients
- **Status breakdown** (draft, sent, paid, overdue)
- **Export capabilities** for accounting integration

### Customization & Settings

- **Company Profile** - Add your business information and logo
- **Invoice Defaults** - Set default tax rates, payment terms, currency
- **Theme Selection** - Choose light, dark, or auto mode
- **Template Preferences** - Set your favorite invoice template

## 🔐 Authentication & Security

### User Authentication

- **Email/Password** with strength validation
- **Google OAuth** for quick sign-in
- **Session Management** with 30-day refresh tokens
- **Remember Me** functionality for convenience

### Security Features

- **Rate Limiting** - 5 login attempts, 30-minute lockout
- **Password Policy** - Minimum 8 characters, mixed case, numbers, symbols
- **CSRF Protection** - Built-in Next.js security
- **Data Encryption** - All sensitive data encrypted at rest
- **Multi-Tenant Isolation** - Complete data separation per user

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
4. Deploy!

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoices
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret_here
NEXT_PUBLIC_APP_NAME=Invoice Manager
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Database Schema

### User Model

- Email, password, name
- Company settings (name, logo, address, contact)
- Invoice preferences (tax rate, payment terms, template)
- Session and refresh tokens

### Customer Model

- Personal information (name, email, phone)
- Company details (name, address)
- Relationship tracking
- Payment history

### Invoice Model

- Invoice details (number, dates, status)
- Line items (description, quantity, rate)
- Calculations (subtotal, tax, discount, total)
- Template selection
- Company information

### Work Description Model

- Reusable service descriptions
- Default rates and terms
- Quick-add functionality

## 🎯 Roadmap

### Upcoming Features

- [ ] Email integration for sending invoices
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Recurring invoices and subscriptions
- [ ] Multi-currency advanced features
- [ ] Team collaboration and permissions
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced reporting and exports
- [ ] API access for integrations

## 💡 Tips & Best Practices

### For Freelancers

- Use work descriptions for common services
- Set up default tax rates in settings
- Choose a template that matches your brand
- Enable company settings for professional invoices

### For Small Businesses

- Add all customers upfront for easy selection
- Use consistent invoice numbering
- Set payment terms in settings (e.g., Net 30)
- Regularly review analytics for insights

### For Enterprises

- Utilize company branding features
- Set up standardized work descriptions
- Use analytics for customer segmentation
- Export data regularly for accounting

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**

- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

**Build Errors**

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

**Authentication Issues**

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/sran4/invoice-manager/issues)
- **Documentation**: Check this README and inline code comments
- **Community**: Join discussions in GitHub Discussions

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [MongoDB](https://www.mongodb.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication

---

**Made with ❤️ for the developer community**

⭐ **Star this repository if you find it helpful!**
