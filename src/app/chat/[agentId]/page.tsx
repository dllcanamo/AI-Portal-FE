"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Bot, ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";
import { getAgentById } from "@/config/agents";
import type { Message, Attachment, AttachmentPayload } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  ChatInput,
  MessageBubble,
  TypingIndicator,
} from "@/components/chat";
import { cn } from "@/lib/utils";

/**
 * Generates a unique ID for a new message.
 */
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Converts a File to a base64-encoded AttachmentPayload for the API.
 */
async function fileToBase64Payload(att: Attachment): Promise<AttachmentPayload | null> {
  if (!att.file) return null;
  const buf = await att.file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return { name: att.name, mimeType: att.mimeType, base64: btoa(binary) };
}

/**
 * Creates an initial greeting message from the assistant.
 */
function createGreetingMessage(agentName: string): Message {
  return {
    id: generateMessageId(),
    role: "assistant",
    content: `Hi! I'm ${agentName}. How can I help you today?`,
    timestamp: new Date(),
  };
}

/**
 * Chat page for a specific agent. Displays conversation history, agent info panel, and input.
 */
export default function ChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = getAgentById(agentId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Initialize with greeting when agent is loaded. */
  useEffect(() => {
    if (agent && messages.length === 0) {
      setMessages([createGreetingMessage(agent.name)]);
    }
  }, [agent, messages.length]);

  /** Auto-scroll to bottom when messages change. */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  /**
   * Sends the user message to /api/chat and streams the assistant's response
   * via SSE, updating the message content as tokens arrive.
   */
  const handleSend = useCallback(
    async (text: string, attachments: Attachment[]) => {
      if (!agent) return;

      const userMessage: Message = {
        id: generateMessageId(),
        role: "user",
        content: text,
        timestamp: new Date(),
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      const assistantMsgId = generateMessageId();
      const assistantMessage: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsTyping(true);

      const payloads: AttachmentPayload[] = [];
      if (attachments.length > 0 && agent.supportsAttachments) {
        const results = await Promise.all(attachments.map(fileToBase64Payload));
        for (const p of results) {
          if (p) payloads.push(p);
        }
      }

      const all = [...messages, userMessage]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));
      const firstUserIdx = all.findIndex((m) => m.role === "user");
      const history = firstUserIdx >= 0 ? all.slice(firstUserIdx) : all;

      const lastIdx = history.length - 1;
      const messagesWithAttachments = history.map((m, i) =>
        i === lastIdx && payloads.length > 0
          ? { ...m, attachments: payloads }
          : m,
      );

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId, messages: messagesWithAttachments }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream available");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("event: error")) {
              const nextDataLine = lines.find((l) => l.startsWith("data: "));
              if (nextDataLine) {
                throw new Error(JSON.parse(nextDataLine.slice(6)));
              }
              continue;
            }

            if (!line.startsWith("data: ")) continue;

            const payload = line.slice(6);
            if (payload === "[DONE]") break;

            const token: string = JSON.parse(payload);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: m.content + token }
                  : m,
              ),
            );
          }
        }
      } catch (err) {
        const errorText =
          err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: m.content
                    ? `${m.content}\n\n---\nError: ${errorText}`
                    : `Sorry, I encountered an error: ${errorText}`,
                }
              : m,
          ),
        );
      } finally {
        setIsTyping(false);
      }
    },
    [agent, agentId, messages],
  );

  if (!agent) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
          Agent not found
        </h2>
        <Link
          href="/agents"
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to agents
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] flex-col",
        "-m-6"
      )}
    >
      {/* Header with back link and info toggle */}
      <div className="flex shrink-0 items-center justify-between border-b border-surface-200 bg-white px-4 py-3 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex items-center gap-3">
          <Link
            href="/agents"
            className="flex items-center gap-1 text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
            aria-label="Back to agents"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Avatar icon={agent.icon} name={agent.name} size="sm" />
          <div>
            <h1 className="font-semibold text-surface-900 dark:text-surface-100">
              {agent.name}
            </h1>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {agent.category}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInfoPanelOpen((o) => !o)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
            "text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
          )}
          aria-expanded={infoPanelOpen}
        >
          <Info className="h-4 w-4" />
          {infoPanelOpen ? (
            <>
              Hide info
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show info
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Collapsible agent info panel - hidden on mobile by default */}
        <aside
          className={cn(
            "shrink-0 w-72 overflow-y-auto border-r border-surface-200 bg-surface-50 transition-all duration-200 dark:border-surface-800 dark:bg-surface-900",
            infoPanelOpen ? "block" : "hidden"
          )}
        >
          {infoPanelOpen && (
            <div className="space-y-4 p-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-surface-900 dark:text-surface-100">
                  {agent.name}
                </h3>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {agent.description}
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-surface-500">
                  Capabilities
                </h4>
                <ul className="space-y-1">
                  {agent.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="text-sm text-surface-700 dark:text-surface-300"
                    >
                      • {cap}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{agent.category}</Badge>
                <Badge
                  variant={
                    agent.status === "online"
                      ? "success"
                      : agent.status === "busy"
                        ? "warning"
                        : "default"
                  }
                >
                  {agent.status}
                </Badge>
              </div>
            </div>
          )}
        </aside>

        {/* Main chat area */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} aria-hidden />
          </div>

          <div className="shrink-0 border-t border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-950">
            <ChatInput
              onSend={handleSend}
              disabled={isTyping}
              supportsAttachments={agent.supportsAttachments ?? false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
