"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskTriggerProps {
  /** Callback when workflow is triggered with user input */
  onTrigger: (input: Record<string, string>) => void;
  /** Whether the workflow is currently running */
  isRunning: boolean;
  /** Display name of the agent */
  agentName: string;
}

/**
 * Card section for triggering a workflow with optional task description input.
 */
export function TaskTrigger({
  onTrigger,
  isRunning,
  agentName,
}: TaskTriggerProps) {
  const [input, setInput] = useState("");

  /**
   * Handles the run button click, passing the input as instructions.
   */
  function handleTrigger() {
    onTrigger({ instructions: input });
  }

  return (
    <div className="rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
        Run {agentName}
      </h2>
      <textarea
        placeholder="Describe your task or leave blank for default workflow..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isRunning}
        className={cn(
          "mt-3 w-full resize-none rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 placeholder:text-surface-500",
          "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
          "dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-400",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
        rows={3}
      />
      <Button
        onClick={handleTrigger}
        disabled={isRunning}
        className="mt-4"
        variant="primary"
      >
        <Zap size={16} />
        {isRunning ? "Running..." : "Run Workflow"}
      </Button>
    </div>
  );
}
