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

### 📊 **Dashboard & Analytics**
- **Real-time Dashboard**: View your business metrics at a glance
- **Invoice Statistics**: Track total invoices, revenue, and status breakdowns
- **Recent Activity**: Quick access to your latest invoices and customers

### 🧾 **Invoice Management**
- **Create Invoices**: Build professional invoices with ease
- **5 Beautiful Templates**: Choose from modern, classic, minimal, professional, and creative designs
- **Template Preview**: See exactly how your invoice will look before creating
- **Auto-calculations**: Automatic tax, discount, and total calculations
- **Invoice Status**: Track draft, sent, paid, and overdue invoices

### 👥 **Customer Management**
- **Customer Database**: Store and manage customer information
- **Quick Selection**: Select customers from dropdown when creating invoices
- **Customer Details**: Name, email, phone, address, and custom fields

### ⚙️ **Settings & Customization**
- **Company Settings**: Manage your company information and branding
- **Theme Preferences**: Choose between light, dark, or auto theme
- **Notification Settings**: Customize your notification preferences
- **Security Settings**: Manage your account security

### 🔐 **Authentication & Security**
- **User Authentication**: Secure login/signup with NextAuth.js
- **User Isolation**: Each user has their own separate system
- **Secure Data**: All data is encrypted and securely stored

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