"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import { getAgentById, getWorkflowSteps } from "@/lib/mock-data";
import type { WorkflowStep } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { StepTracker } from "@/components/tasks/StepTracker";
import { StepDetail } from "@/components/tasks/StepDetail";
import { TaskTrigger } from "@/components/tasks/TaskTrigger";
import { TaskOutput } from "@/components/tasks/TaskOutput";

type RunStatus = "idle" | "running" | "completed" | "failed";

/**
 * Task workflow page for a given agent. Displays agent info, workflow steps,
 * and allows running the workflow with animated step progression.
 */
export default function TaskAgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  const agent = getAgentById(agentId);
  const initialSteps = getWorkflowSteps(agentId);

  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<RunStatus>("idle");

  const handleTrigger = useCallback(
    (input: Record<string, string>) => {
      const freshSteps = getWorkflowSteps(agentId);
      setSteps(freshSteps);
      setActiveStepId(null);
      setIsRunning(true);
      setRunStatus("running");
      setResult(null);

      if (freshSteps.length === 0) {
        setIsRunning(false);
        setRunStatus("completed");
        setResult("No workflow steps configured for this agent.");
        return;
      }

      let cumulativeDelay = 0;

      freshSteps.forEach((step, index) => {
        cumulativeDelay += step.duration ?? 1000;

        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s) =>
              s.id === step.id
                ? { ...s, status: "running" as const }
                : s
            )
          );
          setActiveStepId(step.id);
        }, cumulativeDelay - (step.duration ?? 1000));

        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s) =>
              s.id === step.id
                ? {
                    ...s,
                    status: "completed" as const,
                    output: step.output,
                  }
                : s
            )
          );

          if (index === freshSteps.length - 1) {
            setIsRunning(false);
            setRunStatus("completed");
            setResult(
              `Workflow completed successfully. ${freshSteps.length} steps executed.`
            );
          }
        }, cumulativeDelay);
      });
    },
    [agentId]
  );

  if (!agent) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
          Agent not found
        </h1>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <ArrowLeft size={18} />
          Back to agents
        </Link>
      </div>
    );
  }

  const activeStep = steps.find((s) => s.id === activeStepId) ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <Link
        href="/agents"
        className="inline-flex items-center gap-2 text-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
      >
        <ArrowLeft size={16} />
        Back to agents
      </Link>

      <header className="flex flex-wrap items-start gap-4 rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-900">
        <Avatar icon={agent.icon} name={agent.name} size="lg" />
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            {agent.name}
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            {agent.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap) => (
              <Badge key={cap} variant="default">
                {cap}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <TaskTrigger
        agentName={agent.name}
        isRunning={isRunning}
        onTrigger={handleTrigger}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Workflow steps
          </h2>
          <StepTracker
            activeStepId={activeStepId}
            onStepClick={setActiveStepId}
            steps={steps}
          />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Step details
          </h2>
          <StepDetail step={activeStep} />
        </div>
      </div>

      <TaskOutput result={result} status={runStatus} />
    </div>
  );
}
