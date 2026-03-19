"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { getAgentById, getMockTaskResponse } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { TaskTrigger } from "@/components/tasks/TaskTrigger";
import { TaskOutput } from "@/components/tasks/TaskOutput";

type RunStatus = "idle" | "running" | "completed" | "failed";

/**
 * Simplified task agent page with three phases: input, processing, and output.
 */
export default function TaskAgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = getAgentById(agentId);

  const [status, setStatus] = useState<RunStatus>("idle");
  const [result, setResult] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTrigger = useCallback(
    (input: Record<string, string>) => {
      setStatus("running");
      setResult(null);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setResult(getMockTaskResponse(agentId));
        setStatus("completed");
      }, 2500);
    },
    [agentId]
  );

  /**
   * Resets the page back to the idle input state.
   */
  function handleReset() {
    setStatus("idle");
    setResult(null);
  }

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

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <Link
        href="/tasks"
        className="inline-flex items-center gap-2 text-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
      >
        <ArrowLeft size={16} />
        Back to task agents
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

      {status === "idle" && (
        <TaskTrigger
          agentName={agent.name}
          isRunning={false}
          onTrigger={handleTrigger}
        />
      )}

      {status === "running" && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-surface-200 bg-white p-12 dark:border-surface-700 dark:bg-surface-900">
          <Loader2
            size={40}
            className="animate-spin text-primary-500"
            aria-hidden
          />
          <p className="text-lg font-medium text-surface-700 dark:text-surface-300">
            Processing your task...
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {agent.name} is working on it
          </p>
        </div>
      )}

      {(status === "completed" || status === "failed") && (
        <TaskOutput
          result={result}
          status={status}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
