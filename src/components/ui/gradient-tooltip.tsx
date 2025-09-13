'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Settings, Info } from 'lucide-react';

interface GradientTooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export function GradientTooltip({ children, content, className = "" }: GradientTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate initial position above the trigger
        let x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        let y = triggerRect.top - tooltipRect.height - 8;
        
        // Ensure tooltip stays within viewport bounds
        if (x < 10) x = 10;
        if (x + tooltipRect.width > viewportWidth - 10) {
          x = viewportWidth - tooltipRect.width - 10;
        }
        
        // If tooltip would go above viewport, position it below instead
        if (y < 10) {
          y = triggerRect.bottom + 8;
        }
        
        setPosition({ x, y });
      }
    };

    if (isVisible) {
      // Add a small delay to ensure DOM is fully rendered
      const timeoutId = setTimeout(updatePosition, 0);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed pointer-events-none"
              style={{
                left: position.x,
                top: position.y,
                zIndex: 99999, // Maximum z-index to ensure it's above everything
              }}
            >
              <div className="relative">
                {/* Gradient Background */}
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 rounded-lg shadow-2xl">
                  <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-3 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                        <Settings className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {content}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-slate-800"></div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// Simple info tooltip variant
export function InfoTooltip({ children, content, className = "" }: GradientTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="relative">
              {/* Gradient Background */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 rounded-lg shadow-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Info className="h-3 w-3 text-blue-500" />
                    <p className="text-xs font-medium text-slate-900 dark:text-white">
                      {content}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-slate-800"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
