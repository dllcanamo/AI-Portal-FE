"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskOutputProps {
  /** The result message to display */
  result: string | null;
  /** Current status of the workflow run */
  status: "idle" | "running" | "completed" | "failed";
}

/**
 * Displays workflow completion or failure output with appropriate styling.
 */
export function TaskOutput({ result, status }: TaskOutputProps) {
  if (status === "idle" || status === "running") {
    return null;
  }

  if (status === "completed") {
    return (
      <div
        className={cn(
          "rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900",
          "border-l-4 border-success"
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle
            size={24}
            className="shrink-0 text-success"
            aria-hidden
          />
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">
              Workflow Complete
            </h3>
            {result && (
              <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
                {result}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={cn(
          "rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900",
          "border-l-4 border-error"
        )}
      >
        <div className="flex items-start gap-3">
          <XCircle size={24} className="shrink-0 text-error" aria-hidden />
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">
              Workflow Failed
            </h3>
            {result && (
              <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
                {result}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
