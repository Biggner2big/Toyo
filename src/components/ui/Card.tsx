import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-[#0f1624] border border-slate-800/80 rounded-xl p-6 transition-all",
          hoverEffect && "hover:border-slate-700 hover:bg-[#131b2c] hover:shadow-lg hover:shadow-black/40",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx("mb-4 flex items-center justify-between", className))} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={twMerge(clsx("text-base font-semibold text-slate-100", className))} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge(clsx("text-xs text-slate-400 mt-0.5", className))} {...props}>
      {children}
    </p>
  );
}
