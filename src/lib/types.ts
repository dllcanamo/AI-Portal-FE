export type AgentType = "chat" | "task";

export type AgentStatus = "online" | "offline" | "busy";

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  icon: string;
  category: string;
  capabilities: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type WorkflowStepStatus = "pending" | "running" | "completed" | "failed";

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  status: WorkflowStepStatus;
  output?: string;
  duration?: number;
}

export interface TaskRun {
  id: string;
  agentId: string;
  status: "idle" | "running" | "completed" | "failed";
  steps: WorkflowStep[];
  input: Record<string, string>;
  result?: string;
  startedAt?: Date;
  completedAt?: Date;
}
