'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  ClipboardList,
  Sun,
  Moon,
  Monitor,
  BarChart3,
  Plus,
  X
} from 'lucide-react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4 text-gray-700 dark:text-gray-200" />;
      case 'dark':
        return <Moon className="h-4 w-4 text-gray-700 dark:text-gray-200" />;
      case 'auto':
        return <Monitor className="h-4 w-4 text-gray-700 dark:text-gray-200" />;
      default:
        return <Sun className="h-4 w-4 text-gray-700 dark:text-gray-200" />;
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-blue-400' },
    { name: 'Invoices', href: '/invoices', icon: FileText, color: 'text-green-400' },
    { name: 'Customers', href: '/customers', icon: Users, color: 'text-purple-400' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'text-orange-400' },
    { name: 'Work Descriptions', href: '/work-descriptions', icon: ClipboardList, color: 'text-cyan-400' },
    { name: 'Settings', href: '/settings', icon: Settings, color: 'text-gray-400' },
  ];

  const quickActions = [
    { name: 'New Invoice', href: '/invoices/create', icon: Plus, color: 'from-blue-500 to-cyan-500' },
    { name: 'New Customer', href: '/customers/new', icon: Users, color: 'from-purple-500 to-pink-500' },
  ];

  if (status === 'loading') {
    return (
      <nav className="gradient-card shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div 
                className="h-8 w-8 gradient-red-blue rounded-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/70 border-b border-white/50 dark:border-slate-700/70 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 min-h-[4rem]">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <motion.div 
                  className="h-12 w-12 gradient-red-blue rounded-xl flex items-center justify-center shadow-xl"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText className="h-7 w-7 text-white drop-shadow-lg" />
                </motion.div>
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-blue-600 dark:text-white tracking-wide">
                  Invoice Manager
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on all devices */}
            <div className="hidden items-center space-x-2 min-h-[2rem]">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 px-3 py-2 rounded-lg bg-white/10 dark:bg-slate-800/20 hover:bg-white/30 dark:hover:bg-slate-700/40 group border border-white/20 dark:border-slate-600/30"
                  >
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-4 w-4 text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </motion.div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden items-center space-x-3">
              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button asChild size="sm" className={`bg-gradient-to-r ${action.color} hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
                        <Link href={action.href} className="flex items-center space-x-1 px-3 py-1.5">
                          <Icon className="h-3 w-3" />
                          <span className="text-xs font-medium">{action.name}</span>
                        </Link>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2 bg-white/20 dark:bg-slate-800/40 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-300 border border-white/30 dark:border-slate-600/40 cursor-pointer"
                  title={`Current theme: ${theme}. Click to cycle through themes.`}
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getThemeIcon()}
                  </motion.div>
                </Button>
              </motion.div>
              
              {/* User Menu */}
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300">
                        <Avatar className="h-8 w-8 border-2 border-white/20">
                          <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 border border-white/20 dark:border-slate-700/30 shadow-2xl" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                          {session.user?.name}
                        </p>
                        <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      onClick={() => signOut()}
                      title="Sign out"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild className="gradient-button text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Hamburger Menu Button - Visible on all devices */}
            <div className="mobile-menu-container">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-3 bg-white/30 dark:bg-slate-800/50 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/40 dark:hover:bg-slate-700/60 rounded-xl transition-all duration-300 border border-white/40 dark:border-slate-600/50 shadow-lg hover:shadow-xl cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  <motion.div
                    animate={{ 
                      rotate: isMobileMenuOpen ? 180 : 0,
                      scale: isMobileMenuOpen ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <div className="flex flex-col space-y-1.5">
                        <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Glassmorphism Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 mobile-menu-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="absolute top-0 right-0 h-full w-80 sm:w-96 lg:w-[28rem] max-w-[90vw] backdrop-blur-xl bg-white/10 dark:bg-slate-900/20 border-l border-white/20 dark:border-slate-700/30 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="h-10 w-10 gradient-red-blue rounded-xl flex items-center justify-center shadow-lg"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FileText className="h-6 w-6 text-white drop-shadow-lg" />
                  </motion.div>
                  <span className="text-xl font-black gradient-text dark:text-white dark:drop-shadow-lg tracking-wide">Menu</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-all duration-300"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Navigation Items */}
              <div className="p-6 space-y-2">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </motion.div>
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="p-6 border-t border-white/20 dark:border-slate-700/30">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <motion.div
                          key={action.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        >
                          <Link
                            href={action.href}
                            className={`flex items-center justify-center space-x-2 w-full bg-gradient-to-r ${action.color} hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-3 rounded-lg font-medium`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{action.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Theme Toggle & User Info */}
              <div className="p-6 border-t border-white/20 dark:border-slate-700/30 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    title={`Current theme: ${theme}. Click to cycle through themes.`}
                  >
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getThemeIcon()}
                    </motion.div>
                    <span className="ml-3">Theme: {theme}</span>
                  </Button>
                </motion.div>

                {session && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                    className="flex items-center space-x-3 p-3 bg-white/5 dark:bg-white/5 rounded-lg"
                  >
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => signOut()}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                        title="Sign out"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

