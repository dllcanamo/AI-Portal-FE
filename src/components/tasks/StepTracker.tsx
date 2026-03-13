"use client";

import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/lib/types";
import { Check, X } from "lucide-react";

interface StepTrackerProps {
  /** Array of workflow steps to display */
  steps: WorkflowStep[];
  /** Currently selected/active step ID */
  activeStepId: string | null;
  /** Callback when a step is clicked */
  onStepClick: (stepId: string) => void;
}

/**
 * Vertical stepper showing workflow progress with status icons and connecting lines.
 */
export function StepTracker({
  steps,
  activeStepId,
  onStepClick,
}: StepTrackerProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isActive = activeStepId === step.id;
        const isCompleted =
          step.status === "completed" || step.status === "failed";

        return (
          <div key={step.id} className="relative flex gap-4 pb-2">
            {/* Connecting vertical line (between steps) */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-4 top-10 w-0.5 -translate-x-1/2",
                  "h-[calc(100%-2.5rem-0.5rem)]",
                  isCompleted
                    ? "bg-success"
                    : step.status === "running"
                      ? "bg-primary-500"
                      : "bg-surface-300 dark:bg-surface-600"
                )}
              />
            )}

            {/* Step icon circle */}
            <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center">
              {step.status === "pending" && (
                <div
                  className={cn(
                    "h-8 w-8 rounded-full border-2 border-surface-300 dark:border-surface-600"
                  )}
                />
              )}
              {step.status === "running" && (
                <div
                  className={cn(
                    "h-8 w-8 rounded-full bg-primary-500 animate-pulse"
                  )}
                />
              )}
              {step.status === "completed" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">
                  <Check size={16} />
                </div>
              )}
              {step.status === "failed" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error text-white">
                  <X size={16} />
                </div>
              )}
            </div>

            {/* Step content - clickable */}
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              className={cn(
                "w-full rounded-lg p-3 text-left transition-colors",
                isActive
                  ? "bg-surface-50 dark:bg-surface-800/50"
                  : "hover:bg-surface-50/80 dark:hover:bg-surface-800/30"
              )}
            >
              <div className="font-medium text-surface-900 dark:text-surface-100">
                {step.label}
              </div>
              <div className="mt-0.5 text-sm text-surface-600 dark:text-surface-400">
                {step.description}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
