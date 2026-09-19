import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "outline";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border-slate-700/60",
    primary: "bg-sky-950/80 text-sky-400 border-sky-800/60",
    success: "bg-emerald-950/80 text-emerald-400 border-emerald-800/60",
    warning: "bg-amber-950/80 text-amber-400 border-amber-800/60",
    outline: "bg-transparent text-slate-300 border-slate-700",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
