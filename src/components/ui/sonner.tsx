"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          "--error-bg": "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          "--warning-bg": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          "--info-bg": "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
