import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Maximum attempts per window
  keyGenerator?: (req: NextRequest) => string;
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxAttempts, keyGenerator } = options;
  
  return (req: NextRequest): { success: boolean; remaining: number; resetTime: number } => {
    const key = keyGenerator ? keyGenerator(req) : getDefaultKey(req);
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean up expired entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k];
      }
    });
    
    // Get or create entry
    let entry = store[key];
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
      store[key] = entry;
    }
    
    // Check if limit exceeded
    if (entry.count >= maxAttempts) {
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }
    
    // Increment counter
    entry.count++;
    
    return {
      success: true,
      remaining: maxAttempts - entry.count,
      resetTime: entry.resetTime,
    };
  };
}

function getDefaultKey(req: NextRequest): string {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

// Predefined rate limiters
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5, // 5 attempts per 15 minutes
  keyGenerator: (req) => {
    // Handle both NextRequest and regular request objects
    const headers = req.headers || {};
    const getHeader = (name: string) => {
      if (typeof headers.get === 'function') {
        return headers.get(name);
      }
      return headers[name] || headers[name.toLowerCase()];
    };
    
    const ip = getHeader('x-forwarded-for') || 
               getHeader('x-real-ip') || 
               'unknown';
    return `login-${ip}`;
  },
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 100, // 100 requests per minute
});
