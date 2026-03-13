"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  /** Called when the user sends a message. */
  onSend: (message: string) => void;
  /** When true, disables the input and send button. */
  disabled?: boolean;
}

/**
 * Chat input form with a text field and send button.
 * Manages input state locally and clears on submit.
 */
export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className={cn(
          "flex-1 rounded-lg border border-surface-200 bg-white px-4 py-3 text-surface-900 placeholder:text-surface-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500"
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-white",
          "hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
