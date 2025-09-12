# 🧾 Modern Invoice Management System

A beautiful, modern invoice management system built with Next.js 15, React, MongoDB, and Tailwind CSS. Create professional invoices, manage customers, and track your business with style.

![Invoice Manager](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Beautiful Design**: Modern glassmorphism effects with gradient themes
- **Dark/Light Mode**: Seamless theme switching with stunning dark-to-light gradients
- **Responsive**: Fully responsive design that works on all devices
- **Animations**: Smooth Framer Motion animations throughout the app
- **Professional Layout**: Clean, intuitive interface designed for productivity

### 📊 **Dashboard & Analytics**
- **Real-time Dashboard**: View your business metrics at a glance
- **Invoice Statistics**: Track total invoices, revenue, and status breakdowns
- **Recent Activity**: Quick access to your latest invoices and customers
- **Visual Charts**: Beautiful data visualization for business insights
- **Quick Actions**: Fast access to create invoices, add customers, and view reports

### 🧾 **Advanced Invoice Management**
- **Create Professional Invoices**: Build stunning invoices with our intuitive editor
- **5 Beautiful Templates**: Choose from modern-blue, classic-green, minimal-purple, professional-gray, and creative-orange designs
- **Template-Specific PDFs**: PDF exports automatically match your selected template colors and styling
- **Template Preview**: See exactly how your invoice will look before creating
- **Auto-calculations**: Automatic tax, discount, and total calculations with real-time updates
- **Invoice Status Tracking**: Track draft, sent, paid, and overdue invoices
- **Invoice Numbering**: Automatic invoice numbering system
- **Due Date Management**: Set and track payment due dates
- **Notes & Terms**: Add custom notes and terms to your invoices

### 📄 **PDF Export & Printing**
- **Professional PDF Generation**: High-quality PDF exports using jsPDF
- **Template-Aware PDFs**: PDFs automatically use your selected template colors
- **Company Branding**: PDFs include your company information from settings
- **Timestamp Tracking**: Generation timestamps for record-keeping
- **Print-Ready Format**: Optimized for both digital and physical printing
- **Multi-page Support**: Automatic page breaks for long invoices
- **Clean Layout**: Professional formatting without internal status information

### 👥 **Customer Management**
- **Customer Database**: Store and manage comprehensive customer information
- **Quick Selection**: Select customers from dropdown when creating invoices
- **Customer Details**: Name, email, phone, address, company name, and custom fields
- **Customer Search**: Fast search and filter capabilities
- **Customer History**: View all invoices for each customer
- **Bulk Operations**: Manage multiple customers efficiently

### 🎨 **Template System**
- **5 Professional Templates**: Each with unique color schemes and styling
- **Template Selection**: Choose templates during invoice creation
- **Template Preview**: Preview templates before selection
- **Consistent Branding**: Templates maintain your company branding
- **PDF Integration**: Templates are reflected in PDF exports

### ⚙️ **Settings & Customization**
- **Company Settings**: Manage your company information, logo, and branding
- **Theme Preferences**: Choose between light, dark, or auto theme
- **Notification Settings**: Customize your notification preferences
- **Invoice Defaults**: Set default tax rates, due dates, and currency
- **Security Settings**: Manage your account security
- **User Preferences**: Customize your experience

### 🔐 **Authentication & Security**
- **User Authentication**: Secure login/signup with NextAuth.js
- **User Isolation**: Each user has their own separate system and data
- **Secure Data**: All data is encrypted and securely stored
- **Session Management**: Secure session handling
- **Protected Routes**: Authentication required for all sensitive operations

### 🚀 **Performance & Reliability**
- **Fast Loading**: Optimized for speed and performance
- **Real-time Updates**: Instant updates across the application
- **Error Handling**: Comprehensive error handling and user feedback
- **Toast Notifications**: Beautiful success and error notifications
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Offline Support**: Basic functionality works offline

### 📱 **Mobile Experience**
- **Mobile-First Design**: Optimized for mobile devices
- **Touch-Friendly**: Easy to use on touch screens
- **Responsive Layout**: Adapts to any screen size
- **Mobile Navigation**: Intuitive mobile navigation
- **Fast Performance**: Optimized for mobile networks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
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

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key
   NEXT_PUBLIC_APP_NAME=Invoice Manager
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Create a MongoDB Atlas cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

2. **Set up database user**
   - Create a database user with read/write permissions
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

3. **Update environment variables**
   - Add your MongoDB connection string to `.env.local`

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Modern+Dashboard)

### Invoice Creation
![Invoice Creation](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Create+Invoices)

### Templates
![Templates](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Beautiful+Templates)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PDF Generation**: jsPDF

## 📁 Project Structure

```
invoice-manager/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── invoices/          # Invoice management
│   │   ├── customers/         # Customer management
│   │   ├── templates/         # Template selection
│   │   └── settings/          # Settings page
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   └── layout/           # Layout components
│   ├── contexts/             # React contexts
│   ├── lib/                  # Utility functions
│   │   ├── pdf-export.ts     # PDF generation utilities
│   │   └── company-settings.ts # Company settings management
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── README.md
```

## 🎨 Customization

### Themes
The app supports three themes:
- **Light**: Clean, bright interface
- **Dark**: Dark mode with beautiful gradients
- **Auto**: Automatically switches based on system preference

### Templates
Choose from 5 professional templates:
- **Modern Blue**: Clean and professional with blue gradients
- **Classic Green**: Traditional business layout
- **Minimal Purple**: Simple and elegant design
- **Professional Gray**: Corporate-style template
- **Creative Orange**: Vibrant and creative design

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Add environment variables**
   - Add all variables from your `.env.local` file

3. **Deploy**
   - Click deploy and your app will be live!

### Other Platforms
- **Netlify**: Works with Next.js static export
- **Railway**: Great for full-stack apps
- **DigitalOcean**: VPS deployment option

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [MongoDB](https://www.mongodb.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Made with ❤️ by [Satwant S Sran](https://github.com/sran4)**

⭐ **Star this repository if you found it helpful!**