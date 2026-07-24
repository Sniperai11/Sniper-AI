import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    secondary: "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-800/80",
    destructive: "border-transparent bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-500/30",
    success: "border-transparent bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/70 border border-emerald-500/30",
    warning: "border-transparent bg-amber-900/50 text-amber-400 hover:bg-amber-900/70 border border-amber-500/30",
    outline: "text-slate-100 border-slate-700",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
