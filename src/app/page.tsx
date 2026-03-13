"use client";

import Link from "next/link";
import { agents } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { AgentCard } from "@/components/agents/AgentCard";
import { Badge } from "@/components/ui/Badge";
import {
  Bot,
  MessageSquare,
  Zap,
  ArrowRight,
  Activity,
} from "lucide-react";

const chatAgents = agents.filter((a) => a.type === "chat");
const taskAgents = agents.filter((a) => a.type === "task");
const onlineCount = agents.filter((a) => a.status === "online").length;

const stats = [
  {
    label: "Total Agents",
    value: agents.length,
    icon: Bot,
    color: "text-primary-600 bg-primary-50 dark:bg-primary-950 dark:text-primary-400",
  },
  {
    label: "Chat Agents",
    value: chatAgents.length,
    icon: MessageSquare,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Task Agents",
    value: taskAgents.length,
    icon: Zap,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "Online Now",
    value: onlineCount,
    icon: Activity,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400",
  },
];

/**
 * Dashboard home page showing overview stats and featured agents.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Welcome to AI Portal
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Your hub for AI agents — chat, automate, and explore.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {stat.label}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chat Agents */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare
              size={20}
              className="text-primary-600 dark:text-primary-400"
            />
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              Chat Agents
            </h2>
            <Badge variant="primary">{chatAgents.length}</Badge>
          </div>
          <Link
            href="/agents?type=chat"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {chatAgents.slice(0, 3).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Task Agents */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap
              size={20}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              Task Agents
            </h2>
            <Badge variant="success">{taskAgents.length}</Badge>
          </div>
          <Link
            href="/agents?type=task"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {taskAgents.slice(0, 3).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  );
}
