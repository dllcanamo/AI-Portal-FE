"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Filter, Search } from "lucide-react";
import { agents } from "@/config/agents";
import type { Agent } from "@/lib/types";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | "chat" | "task";

/**
 * Extracts unique category values from the agents array, sorted alphabetically.
 */
function getUniqueCategories(agentList: Agent[]): string[] {
  const categories = new Set(agentList.map((a) => a.category));
  return Array.from(categories).sort();
}

/**
 * Filters agents by type, category, and search query.
 */
function filterAgents(
  agentList: Agent[],
  typeFilter: TypeFilter,
  categoryFilter: string,
  searchQuery: string
): Agent[] {
  return agentList.filter((agent) => {
    if (typeFilter !== "all" && agent.type !== typeFilter) return false;
    if (categoryFilter && agent.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = agent.name.toLowerCase().includes(q);
      const matchesDescription = agent.description.toLowerCase().includes(q);
      if (!matchesName && !matchesDescription) return false;
    }
    return true;
  });
}

/**
 * Agent Catalog page wrapper that provides a Suspense boundary for useSearchParams.
 */
export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-surface-500">Loading...</div>}>
      <AgentsPageContent />
    </Suspense>
  );
}

/**
 * Agent Catalog page content: browse and filter all available agents by type, category, and search.
 */
function AgentsPageContent() {
  const searchParams = useSearchParams();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>(() => {
    const type = searchParams.get("type");
    if (type === "chat" || type === "task") return type;
    return "all";
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => getUniqueCategories(agents), []);

  const filteredAgents = useMemo(
    () => filterAgents(agents, typeFilter, categoryFilter, searchQuery),
    [typeFilter, categoryFilter, searchQuery]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Bot className="h-6 w-6" aria-hidden />
            All Agents
          </h1>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
            Browse and discover AI agents for chat and task automation.
          </p>
        </div>
        <Badge variant="primary" className="self-start sm:self-auto">
          {filteredAgents.length} agents
        </Badge>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-surface-500" aria-hidden />
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
            Filters
          </span>
        </div>

        {/* Type toggle buttons */}
        <div className="flex rounded-lg border border-surface-200 bg-surface-50 p-0.5 dark:border-surface-700 dark:bg-surface-900">
          {(["all", "chat", "task"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                typeFilter === type
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                  : "text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
              )}
            >
              {type === "all" ? "All" : type === "chat" ? "Chat" : "Task"}
            </button>
          ))}
        </div>

        {/* Category select */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-400"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-9 pr-3 text-sm text-surface-900 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-400"
          />
        </div>
      </div>

      {/* Agent grid */}
      <AgentGrid agents={filteredAgents} />
    </div>
  );
}
