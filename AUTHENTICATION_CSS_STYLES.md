# 🎨 Authentication System - CSS Styles & Animations

## 🎯 **Core CSS Classes**

### **1. Glassmorphism Effects**

```css
/* Glass Card */
.glass-card {
  @apply bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-lg overflow-hidden;
}

/* Glass Input */
.glass-input {
  @apply bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30;
}

/* Glass Button */
.glass-button {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98];
}

/* Glass Button Secondary */
.glass-button-secondary {
  @apply bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 text-foreground border border-white/20 dark:border-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98];
}
```

### **2. Gradient Text Effects**

```css
/* Primary Gradient Text */
.gradient-text-primary {
  @apply bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent;
}

/* Secondary Gradient Text */
.gradient-text-secondary {
  @apply bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent;
}

/* Card Title Gradient */
.gradient-text-card {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent;
}
```

### **3. Custom Toggle Switch**

```css
/* Toggle Track */
.toggle-track {
  @apply relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Toggle Track Active */
.toggle-track-active {
  @apply bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500;
}

/* Toggle Track Inactive */
.toggle-track-inactive {
  @apply bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600;
}

/* Toggle Handle */
.toggle-handle {
  @apply absolute h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300;
}

/* Toggle Handle Active */
.toggle-handle-active {
  @apply right-0.5;
}

/* Toggle Handle Inactive */
.toggle-handle-inactive {
  @apply left-0.5;
}
```

### **4. Loading States**

```css
/* Loading Spinner */
.loading-spinner {
  @apply animate-spin rounded-full h-5 w-5 border-b-2 border-white;
}

/* Loading Button */
.loading-button {
  @apply cursor-not-allowed opacity-75;
}

/* Loading Container */
.loading-container {
  @apply cursor-not-allowed;
}
```

### **5. Form Validation States**

```css
/* Input Error */
.input-error {
  @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

/* Input Success */
.input-success {
  @apply border-green-500 focus:ring-green-500 focus:border-green-500;
}

/* Error Text */
.error-text {
  @apply text-red-500 text-sm mt-1;
}

/* Success Text */
.success-text {
  @apply text-green-500 text-sm mt-1;
}
```

## 🎭 **Animation Classes**

### **1. Framer Motion Variants**

```typescript
// Page entrance animation
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Staggered card animation
export const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Button hover animations
export const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

// Toggle switch animation
export const toggleVariants = {
  on: { x: 0 },
  off: { x: 0 }
};
```

### **2. Custom Animations**

```css
/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Glow Animation */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

/* Pulse Animation */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Bounce Animation */
@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}
```

## 🌈 **Background Effects**

### **1. Animated Background**

```css
/* Gradient Background */
.gradient-background {
  @apply bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900;
}

/* Floating Orbs */
.floating-orb-1 {
  @apply absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse;
}

.floating-orb-2 {
  @apply absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000;
}

.floating-orb-3 {
  @apply absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000;
}

/* Grid Pattern */
.grid-pattern {
  @apply absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)];
}
```

### **2. Card Glow Effects**

```css
/* Card Glow */
.card-glow {
  @apply absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20;
}

/* Animated Border */
.animated-border {
  @apply absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 p-[1px];
}

.animated-border-inner {
  @apply h-full w-full rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-xl;
}
```

## 🎨 **Password Strength Indicator**

```css
/* Strength Indicator Container */
.strength-indicator {
  @apply bg-white/10 dark:bg-black/20 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-sm p-4;
}

/* Strength Item */
.strength-item {
  @apply flex items-center text-sm;
}

/* Strength Dot */
.strength-dot {
  @apply w-2 h-2 rounded-full mr-2;
}

/* Strength Colors */
.strength-dot-weak { @apply bg-red-500; }
.strength-dot-medium { @apply bg-yellow-500; }
.strength-dot-strong { @apply bg-green-500; }

/* Strength Text */
.strength-text-weak { @apply text-red-500; }
.strength-text-medium { @apply text-yellow-500; }
.strength-text-strong { @apply text-green-500; }
```

## 🔧 **Utility Classes**

### **1. Spacing & Layout**

```css
/* Container Spacing */
.auth-container {
  @apply relative z-10 flex items-center justify-center min-h-screen py-3 px-4 sm:px-6 lg:px-8;
}

.auth-content {
  @apply max-w-md w-full space-y-4;
}

.auth-header {
  @apply text-center;
}

.auth-card {
  @apply relative bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-lg overflow-hidden;
}

.auth-form {
  @apply relative z-10 p-6 space-y-6;
}
```

### **2. Interactive States**

```css
/* Hover Effects */
.hover-lift {
  @apply transition-transform duration-300 hover:scale-[1.02];
}

.hover-glow {
  @apply transition-shadow duration-300 hover:shadow-xl;
}

.hover-fade {
  @apply transition-opacity duration-300 hover:opacity-80;
}

/* Focus States */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.focus-border {
  @apply focus:border-blue-500 focus:ring-blue-500;
}
```

### **3. Responsive Design**

```css
/* Mobile First */
.mobile-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

.mobile-spacing {
  @apply py-3 sm:py-6 lg:py-12;
}

.mobile-text {
  @apply text-sm sm:text-base lg:text-lg;
}

.mobile-button {
  @apply py-2 px-4 sm:py-3 sm:px-6;
}
```

## 🎯 **Theme Support**

### **1. Dark Mode Classes**

```css
/* Dark mode backgrounds */
.dark-bg-primary { @apply dark:bg-slate-900; }
.dark-bg-secondary { @apply dark:bg-slate-800; }
.dark-bg-tertiary { @apply dark:bg-slate-700; }

/* Dark mode text */
.dark-text-primary { @apply dark:text-white; }
.dark-text-secondary { @apply dark:text-slate-300; }
.dark-text-muted { @apply dark:text-slate-400; }

/* Dark mode borders */
.dark-border-primary { @apply dark:border-slate-700; }
.dark-border-secondary { @apply dark:border-slate-600; }
```

### **2. Light Mode Classes**

```css
/* Light mode backgrounds */
.light-bg-primary { @apply bg-white; }
.light-bg-secondary { @apply bg-gray-50; }
.light-bg-tertiary { @apply bg-gray-100; }

/* Light mode text */
.light-text-primary { @apply text-gray-900; }
.light-text-secondary { @apply text-gray-700; }
.light-text-muted { @apply text-gray-500; }

/* Light mode borders */
.light-border-primary { @apply border-gray-200; }
.light-border-secondary { @apply border-gray-300; }
```

## 🚀 **Performance Optimizations**

```css
/* Hardware Acceleration */
.gpu-accelerated {
  @apply transform-gpu;
}

/* Smooth Transitions */
.smooth-transition {
  @apply transition-all duration-300 ease-in-out;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-glow,
  .animate-pulse-slow,
  .animate-bounce-gentle {
    animation: none;
  }
}
```

## 📱 **Mobile Optimizations**

```css
/* Touch Targets */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}

/* Mobile Gestures */
.mobile-gesture {
  @apply touch-manipulation;
}

/* Mobile Scrolling */
.mobile-scroll {
  @apply -webkit-overflow-scrolling-touch;
}
```

This CSS system provides a complete styling solution for modern authentication pages with glassmorphism effects, smooth animations, and responsive design.
