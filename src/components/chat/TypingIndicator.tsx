"use client";

import { cn } from "@/lib/utils";

/**
 * Displays a typing indicator with three bouncing dots.
 * Uses staggered animation delays (0ms, 150ms, 300ms) for a wave effect.
 */
export function TypingIndicator() {
  return (
    <>
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
      <div
        className={cn(
          "flex max-w-[80%] flex-col",
          "mr-auto items-start"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3",
            "bg-surface-100 dark:bg-surface-800"
          )}
        >
          <span
            className="h-2 w-2 rounded-full bg-surface-400 dark:bg-surface-500"
            style={{ animation: "typing-bounce 1s infinite ease-in-out" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-surface-400 dark:bg-surface-500"
            style={{
              animation: "typing-bounce 1s infinite ease-in-out",
              animationDelay: "150ms",
            }}
          />
          <span
            className="h-2 w-2 rounded-full bg-surface-400 dark:bg-surface-500"
            style={{
              animation: "typing-bounce 1s infinite ease-in-out",
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    </>
  );
}
