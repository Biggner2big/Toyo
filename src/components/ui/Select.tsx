import React, { SelectHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: string[] | { label: string; value: string }[];
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, children, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-slate-300 mb-1.5">
            {label}
            {props.required && <span className="text-rose-400 ml-0.5">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-3.5 py-2 text-sm rounded-lg bg-[#0d1320] border text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-1 cursor-pointer",
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                : "border-slate-700/80 focus:border-primary-400 focus:ring-primary-400",
              className
            )
          )}
          {...props}
        >
          {options
            ? options.map((opt) => {
                const isObj = typeof opt === "object" && opt !== null;
                const val = isObj ? opt.value : opt;
                const lbl = isObj ? opt.label : opt;
                return (
                  <option key={val} value={val} className="bg-[#0f1624] text-slate-200">
                    {lbl}
                  </option>
                );
              })
            : children}
        </select>
        {error ? (
          <p className="mt-1 text-xs text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
