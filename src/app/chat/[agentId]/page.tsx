"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Bot, ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";
import { getAgentById, getMockResponse } from "@/lib/mock-data";
import type { Message } from "@/lib/types";
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

  const handleSend = useCallback(
    (text: string) => {
      if (!agent) return;

      const userMessage: Message = {
        id: generateMessageId(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const delay = 1000 + Math.random() * 1000;
      setTimeout(() => {
        const response = getMockResponse(agentId);
        const assistantMessage: Message = {
          id: generateMessageId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, delay);
    },
    [agent, agentId]
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
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
}
