"use client";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  /** The message to display. */
  message: Message;
}

/**
 * Formats a Date to a readable time string (e.g. "2:30 PM").
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Renders a single chat message bubble with role-specific styling.
 * User messages are right-aligned with primary background; assistant messages are left-aligned.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const timestamp = message.timestamp instanceof Date
    ? message.timestamp
    : new Date(message.timestamp);

  return (
    <div
      className={cn(
        "flex max-w-[80%] flex-col",
        isUser ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-3",
          isUser
            ? "rounded-br-md bg-primary-600 text-white"
            : "rounded-bl-md bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-100"
        )}
      >
        <span className="whitespace-pre-wrap break-words">{message.content}</span>
      </div>
      <span className="mt-1 text-xs text-surface-400">{formatTime(timestamp)}</span>
    </div>
  );
}
