"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * Reusable text input with consistent styling.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2 text-sm text-surface-900 placeholder:text-surface-400 transition-colors duration-150 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-400",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
