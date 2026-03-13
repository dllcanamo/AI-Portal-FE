"use client";

import { agents } from "@/lib/mock-data";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const chatAgents = agents.filter((a) => a.type === "chat");

/**
 * Chat Agents listing page showing all conversational agents.
 */
export default function ChatAgentsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare
            size={24}
            className="text-primary-600 dark:text-primary-400"
          />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Chat Agents
          </h1>
          <Badge variant="primary">{chatAgents.length}</Badge>
        </div>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Conversational agents you can chat with directly. Ask questions, get
          answers, brainstorm ideas.
        </p>
      </div>
      <AgentGrid agents={chatAgents} />
    </div>
  );
}
