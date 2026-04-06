export type AgentType = "chat" | "task";

export type AgentStatus = "online" | "offline" | "busy";

/** Determines which backend service handles this agent's requests. */
export type AgentBackend = "bedrock" | "agentcore-a2a";

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  icon: string;
  category: string;
  capabilities: string[];
  /** Which backend service handles this agent. */
  backend: AgentBackend;
  /** Bedrock model ID override; falls back to BEDROCK_MODEL_ID env var. (bedrock backend) */
  modelId?: string;
  /** System prompt sent to the model for this agent's conversations. (bedrock backend) */
  systemPrompt?: string;
  /** AgentCore Runtime ARN for A2A agents. (agentcore-a2a backend) */
  agentRuntimeArn?: string;
  /** Optional endpoint qualifier for A2A agents. (agentcore-a2a backend) */
  agentRuntimeQualifier?: string;
  /** Whether this agent accepts file/image attachments in chat. */
  supportsAttachments?: boolean;
}

export type AttachmentType = "image" | "file";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  attachmentType: AttachmentType;
  url: string;
  /** Raw File reference retained for base64 conversion at send time. */
  file?: File;
}

/** Serialized attachment payload sent to the API. */
export interface AttachmentPayload {
  name: string;
  mimeType: string;
  base64: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
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
