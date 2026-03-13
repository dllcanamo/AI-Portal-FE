"use client";

import { Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

/**
 * Top header bar with search input, notifications, and user avatar.
 */
export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-6 backdrop-blur-sm dark:border-surface-800 dark:bg-surface-950/80",
        className
      )}
    >
      <div className="relative max-w-md flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
        />
        <input
          type="text"
          placeholder="Search agents..."
          className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-9 pr-4 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500"
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
        </button>

        <button
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200 dark:bg-primary-950 dark:text-primary-400 dark:hover:bg-primary-900"
          aria-label="User menu"
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
