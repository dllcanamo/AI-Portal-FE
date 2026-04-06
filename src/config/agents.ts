import type { Agent } from "@/lib/types";

/**
 * Agent configuration registry.
 * This is the single source of truth for all agents until the admin CRUD
 * feature is built. Add, edit, or remove agents here.
 */
export const agents: Agent[] = [
  {
    id: "bedrock-test",
    name: "Bedrock Test Agent",
    description:
      "Chat agent powered by Amazon Nova Lite via the Bedrock Converse API.",
    type: "chat",
    status: "online",
    icon: "bot",
    category: "General",
    capabilities: ["General conversation", "Q&A", "Summarization"],
    backend: "bedrock",
    modelId: "apac.amazon.nova-lite-v1:0",
    systemPrompt: "You are a helpful assistant.",
    supportsAttachments: false,
  },
  {
    id: "nova-pro-docs",
    name: "Nova Pro Document Agent",
    description:
      "Chat agent powered by Amazon Nova Pro with document and image understanding.",
    type: "chat",
    status: "online",
    icon: "file-search",
    category: "Documents",
    capabilities: [
      "Document analysis",
      "Image understanding",
      "Q&A",
      "Summarization",
    ],
    backend: "bedrock",
    modelId: "apac.amazon.nova-pro-v1:0",
    systemPrompt:
      "You are a helpful document analysis assistant. When the user uploads documents or images, analyze their contents thoroughly and answer questions about them. Provide clear, structured summaries when appropriate.",
    supportsAttachments: true,
  },
  {
    id: "agentcore-test",
    name: "AgentCore Test Agent",
    description:
      "Task agent powered by an A2A endpoint in AgentCore Runtime.",
    type: "task",
    status: "online",
    icon: "cpu",
    category: "Automation",
    capabilities: ["Task execution", "Workflow automation"],
    backend: "agentcore-a2a",
  },
];

/**
 * Looks up an agent by its unique ID.
 */
export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
