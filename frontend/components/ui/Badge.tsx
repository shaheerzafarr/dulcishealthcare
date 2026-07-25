import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "danger" | "warning" | "outline" | "teal";
}

export default function Badge({ children, className, variant = "primary", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase";

  const variants = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    accent: "bg-accent/15 text-[#5e8218] border border-accent/30",
    teal: "bg-teal/10 text-teal border border-teal/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    outline: "border border-border-custom bg-transparent text-foreground",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
