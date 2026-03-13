"use client";

import { agents } from "@/lib/mock-data";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const taskAgents = agents.filter((a) => a.type === "task");

/**
 * Task Agents listing page showing all workflow-based agents.
 */
export default function TaskAgentsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Zap
            size={24}
            className="text-emerald-600 dark:text-emerald-400"
          />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Task Agents
          </h1>
          <Badge variant="success">{taskAgents.length}</Badge>
        </div>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Agents that automate workflows. Trigger them, watch progress in real
          time, and get results.
        </p>
      </div>
      <AgentGrid agents={taskAgents} />
    </div>
  );
}
