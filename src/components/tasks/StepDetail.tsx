"use client";

import type { WorkflowStep } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface StepDetailProps {
  /** The selected workflow step, or null if none selected */
  step: WorkflowStep | null;
}

/**
 * Renders detailed information for the selected workflow step.
 */
export function StepDetail({ step }: StepDetailProps) {
  if (!step) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-surface-200 bg-surface-50 p-8 text-center dark:border-surface-700 dark:bg-surface-900/50">
        <p className="text-surface-500 dark:text-surface-400">
          Select a step to view details
        </p>
      </div>
    );
  }

  const statusVariant =
    step.status === "completed"
      ? "success"
      : step.status === "failed"
        ? "error"
        : step.status === "running"
          ? "primary"
          : "default";

  const showOutput =
    (step.status === "completed" || step.status === "failed") &&
    step.output != null;

  return (
    <div className="rounded-lg border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
        {step.label}
      </h3>
      <Badge variant={statusVariant} className="mt-2">
        {step.status}
      </Badge>
      <p className="mt-3 text-sm text-surface-600 dark:text-surface-400">
        {step.description}
      </p>

      {showOutput && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
            Output
          </h4>
          <pre
            className={cn(
              "overflow-x-auto rounded-lg bg-surface-900 p-4 font-mono text-sm text-green-400 dark:bg-surface-950"
            )}
          >
            {step.output}
          </pre>
        </div>
      )}

      {step.duration != null && (step.status === "completed" || step.status === "failed") && (
        <p className="mt-4 text-sm text-surface-500 dark:text-surface-400">
          Completed in {(step.duration / 1000).toFixed(1)}s
        </p>
      )}
    </div>
  );
}
