"use client";

import Link from "next/link";
import { Paperclip } from "lucide-react";
import { Agent } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

const statusColor: Record<string, string> = {
  online: "bg-success",
  offline: "bg-surface-300 dark:bg-surface-600",
  busy: "bg-warning",
};

/**
 * Card component displaying an agent's info with link to its interface.
 */
export function AgentCard({ agent }: AgentCardProps) {
  const href =
    agent.type === "chat" ? `/chat/${agent.id}` : `/tasks/${agent.id}`;

  return (
    <Link href={href}>
      <Card hover className="group h-full">
        <div className="flex items-start gap-4">
          <Avatar icon={agent.icon} name={agent.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-surface-900 dark:text-white">
                {agent.name}
              </h3>
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  statusColor[agent.status]
                )}
                title={agent.status}
              />
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-surface-500 dark:text-surface-400">
              {agent.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant={agent.type === "chat" ? "primary" : "success"}>
                {agent.type === "chat" ? "Chat" : "Task"}
              </Badge>
              <Badge>{agent.category}</Badge>
              {agent.supportsAttachments && (
                <Badge variant="default">
                  <Paperclip className="mr-1 inline h-3 w-3" />
                  Files
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
