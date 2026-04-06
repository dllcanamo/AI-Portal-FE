"use client";

import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TaskOutputProps {
  /** The result message to display */
  result: string | null;
  /** Current status of the task run */
  status: "completed" | "failed";
  /** Callback to reset and run the task again */
  onReset: () => void;
}

/**
 * Displays the task result with a status indicator and the full output content.
 */
export function TaskOutput({ result, status, onReset }: TaskOutputProps) {
  const isSuccess = status === "completed";

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-6 dark:bg-surface-900",
        isSuccess
          ? "border-success/40 dark:border-success/30"
          : "border-error/40 dark:border-error/30"
      )}
    >
      <div className="flex items-center gap-3">
        {isSuccess ? (
          <CheckCircle size={24} className="shrink-0 text-success" aria-hidden />
        ) : (
          <XCircle size={24} className="shrink-0 text-error" aria-hidden />
        )}
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
          {isSuccess ? "Task Complete" : "Task Failed"}
        </h3>
      </div>

      {result && (
        <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-surface-50 p-4 font-sans text-sm leading-relaxed text-surface-700 dark:bg-surface-800 dark:text-surface-300">
          {result}
        </pre>
      )}

      <Button
        onClick={onReset}
        variant="secondary"
        className="mt-6"
      >
        <RotateCcw size={16} />
        Run Again
      </Button>
    </div>
  );
}
