# 🎨 Authentication System - HTML Structure & Components

## 📋 **Modern Authentication Pages**

### **1. Signin Page Structure**

```html
<!-- Animated Background Container -->
<div class="min-h-screen relative overflow-hidden">
  <!-- Floating Gradient Orbs -->
  <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
  <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
  <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
  
  <!-- Grid Pattern Overlay -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]"></div>
  
  <!-- Main Content -->
  <div class="relative z-10 flex items-center justify-center min-h-screen py-3 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-4">
      
      <!-- Header Section -->
      <div class="text-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Sign in to your account
        </h1>
      </div>
      
      <!-- Glassmorphism Card -->
      <div class="relative bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-lg overflow-hidden">
        
        <!-- Card Glow Effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20"></div>
        
        <!-- Animated Border -->
        <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 p-[1px]">
          <div class="h-full w-full rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-xl"></div>
        </div>
        
        <!-- Form Content -->
        <div class="relative z-10 p-6">
          <form className="space-y-6">
            
            <!-- Email Input -->
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30"
                placeholder="Enter your email"
              />
            </div>
            
            <!-- Password Input -->
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 pr-12"
                  placeholder="Enter your password"
                />
                <!-- Eye Icon for Password Toggle -->
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- Remember Me Toggle -->
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <!-- Custom Toggle Switch -->
                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500">
                  <!-- Toggle Circle -->
                  <div className="absolute h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300 right-0.5"></div>
                </button>
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>
            </div>
            
            <!-- Sign In Button -->
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Sign in to your account
            </button>
            
            <!-- Google Sign In Button -->
            <button type="button" className="w-full bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 text-foreground font-medium py-3 px-4 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Continue with Google
            </button>
            
            <!-- Links Section -->
            <div className="text-center space-y-2">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600 transition-colors hover:underline">
                Forgot password?
              </a>
              <div className="text-sm text-muted-foreground">
                Need help? <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors hover:underline">Password help</a>
              </div>
            </div>
            
            <!-- Create Account Link -->
            <div className="text-center pt-1">
              <a href="/auth/signup" className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors hover:underline">
                Create a New Account
              </a>
            </div>
            
          </form>
        </div>
      </div>
      
      <!-- Back to Home Link -->
      <div className="flex justify-start">
        <a href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </a>
      </div>
      
    </div>
  </div>
</div>
```

### **2. Signup Page Structure**

```html
<!-- Similar structure to signin but with additional fields -->
<div class="min-h-screen relative overflow-hidden">
  <!-- Same animated background as signin -->
  
  <div class="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create your account
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          Get started with your free account today
        </p>
      </div>
      
      <!-- Glassmorphism Card with Form -->
      <div class="relative bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-lg overflow-hidden">
        
        <!-- Same glow and border effects -->
        
        <div class="relative z-10 p-6">
          <form className="space-y-6">
            
            <!-- Name Input -->
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30"
                placeholder="Enter your full name"
              />
            </div>
            
            <!-- Email Input -->
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30"
                placeholder="Enter your email"
              />
            </div>
            
            <!-- Password Input with Strength Indicator -->
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 pr-12"
                  placeholder="Create a strong password"
                />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
              
              <!-- Password Strength Indicator -->
              <div className="mt-3 bg-white/10 dark:bg-black/20 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-sm p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Password Strength</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-red-500">At least 8 characters</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-red-500">Include lowercase letters</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-red-500">Include uppercase letters</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-red-500">Include numbers</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-red-500">Include special characters</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Confirm Password Input -->
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 pr-12"
                  placeholder="Confirm your password"
                />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- Create Account Button -->
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Create Account
            </button>
            
            <!-- Google Sign Up Button -->
            <button type="button" className="w-full bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 text-foreground font-medium py-3 px-4 rounded-lg border border-white/20 dark:border-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Continue with Google
            </button>
            
            <!-- Sign In Link -->
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account? 
                <a href="/auth/signin" className="text-blue-500 hover:text-blue-600 transition-colors hover:underline ml-1">
                  Sign in
                </a>
              </span>
            </div>
            
          </form>
        </div>
      </div>
      
    </div>
  </div>
</div>
```

## 🎯 **Key HTML Elements**

### **1. Glassmorphism Card Structure**
- `bg-white/10 dark:bg-black/20` - Semi-transparent background
- `backdrop-blur-xl` - Blur effect behind the card
- `border border-white/20 dark:border-white/10` - Subtle borders
- `shadow-2xl` - Large shadow for depth

### **2. Input Field Structure**
- `bg-white/10 dark:bg-black/20` - Glassmorphism background
- `border border-white/20 dark:border-white/10` - Subtle borders
- `focus:ring-2 focus:ring-blue-500` - Focus ring
- `backdrop-blur-sm` - Subtle blur effect

### **3. Button Structure**
- `bg-gradient-to-r from-blue-600 to-purple-600` - Gradient background
- `hover:scale-[1.02] active:scale-[0.98]` - Hover animations
- `transition-all duration-300` - Smooth transitions
- `cursor-pointer` - Pointer cursor on hover

### **4. Custom Toggle Switch**
- `relative inline-flex h-6 w-11` - Toggle track
- `absolute h-4 w-4 rounded-full` - Toggle handle
- `transition-all duration-300` - Smooth animations
- `focus:ring-2 focus:ring-blue-500` - Focus ring

## 🔧 **Required Icons (Lucide React)**

```typescript
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  FileText,
  Loader2,
  X
} from 'lucide-react';
```

## 📱 **Responsive Design**

- `min-h-screen` - Full viewport height
- `max-w-md w-full` - Maximum width with full width on mobile
- `px-4 sm:px-6 lg:px-8` - Responsive padding
- `py-3` - Vertical padding for mobile optimization
