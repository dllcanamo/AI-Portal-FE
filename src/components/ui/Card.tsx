import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

/**
 * Reusable card container with optional hover effect.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900",
          hover &&
            "transition-all duration-200 hover:shadow-md hover:border-surface-300 dark:hover:border-surface-700 cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
