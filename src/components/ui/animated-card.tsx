'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  tiltIntensity?: number;
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  className = '', 
  hoverScale = 1.02,
  tiltIntensity = 5,
  delay = 0
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: hoverScale,
        rotateX: tiltIntensity,
        rotateY: tiltIntensity,
        transition: { duration: 0.2 }
      }}
      style={{ perspective: 1000 }}
    >
      <Card className={`transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 ${className}`}>
        {children}
      </Card>
    </motion.div>
  );
}

export function AnimatedButton({ 
  children, 
  className = '',
  delay = 0,
  ...props 
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button className={className} {...props}>
        {children}
      </button>
    </motion.div>
  );
}
