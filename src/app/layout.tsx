import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/components/providers/SessionProvider";
import ClientNavigation from "@/components/layout/ClientNavigation";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Invoice Manager - Modern Invoice Creation",
  description: "Create, manage, and export professional invoices with modern templates and animations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SessionProvider>
            <ClientNavigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster 
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
              duration={8000}
              toastOptions={{
                style: {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                },
                className: 'toast-gradient',
              }}
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
