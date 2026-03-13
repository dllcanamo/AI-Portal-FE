import { Agent } from "@/lib/types";
import { AgentCard } from "./AgentCard";

interface AgentGridProps {
  agents: Agent[];
}

/**
 * Responsive grid layout for rendering agent cards.
 */
export function AgentGrid({ agents }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 py-16 text-center dark:border-surface-800">
        <p className="text-sm text-surface-500 dark:text-surface-400">
          No agents found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
