"use client";

import { useState } from "react";
import type { Message, Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/file-validation";
import { FileText, Download, X, Paperclip } from "lucide-react";

interface MessageBubbleProps {
  /** The message to display. */
  message: Message;
}

/**
 * Formats a Date to a readable time string (e.g. "2:30 PM").
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Renders an image attachment as an inline thumbnail that expands to a lightbox on click.
 */
function ImageAttachment({ attachment }: { attachment: Attachment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="block overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-48 max-w-full rounded-lg object-cover transition-transform hover:scale-[1.02]"
        />
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-modal
          aria-label={`Expanded view of ${attachment.name}`}
        >
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/**
 * Renders a file attachment as a downloadable card with icon, name, and size.
 */
function FileAttachment({
  attachment,
  isUser,
}: {
  attachment: Attachment;
  isUser: boolean;
}) {
  return (
    <a
      href={attachment.url}
      download={attachment.name}
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        isUser
          ? "border-primary-400 bg-primary-500 hover:bg-primary-400"
          : "border-surface-200 bg-white hover:bg-surface-50"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-primary-700 text-white" : "bg-primary-50 text-primary-600"
        )}
      >
        <FileText size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            isUser ? "text-white" : "text-surface-800"
          )}
        >
          {attachment.name}
        </p>
        <p
          className={cn(
            "text-xs",
            isUser ? "text-primary-100" : "text-surface-400"
          )}
        >
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <Download
        size={14}
        className={isUser ? "text-primary-200" : "text-surface-400"}
      />
    </a>
  );
}

/**
 * Renders a single chat message bubble with role-specific styling.
 * Supports text content and optional image/file attachments.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const timestamp =
    message.timestamp instanceof Date
      ? message.timestamp
      : new Date(message.timestamp);

  const imageAttachments =
    message.attachments?.filter((a) => a.attachmentType === "image") ?? [];
  const fileAttachments =
    message.attachments?.filter((a) => a.attachmentType === "file") ?? [];

  return (
    <div
      className={cn(
        "flex max-w-[80%] flex-col",
        isUser ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      {/* Attachments section */}
      {(imageAttachments.length > 0 || fileAttachments.length > 0) && (
        <div className="mb-1.5 w-full space-y-2">
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              isUser ? "text-primary-600" : "text-surface-500"
            )}
          >
            <Paperclip size={12} />
            {imageAttachments.length + fileAttachments.length === 1
              ? "1 attachment"
              : `${imageAttachments.length + fileAttachments.length} attachments`}
          </span>

          {imageAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageAttachments.map((att) => (
                <ImageAttachment key={att.id} attachment={att} />
              ))}
            </div>
          )}

          {fileAttachments.length > 0 && (
            <div className="flex w-full flex-col gap-1.5">
              {fileAttachments.map((att) => (
                <FileAttachment key={att.id} attachment={att} isUser={isUser} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Text content */}
      {message.content && (
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "rounded-br-md bg-primary-600 text-white"
              : "rounded-bl-md bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-100"
          )}
        >
          <span className="whitespace-pre-wrap break-words">
            {message.content}
          </span>
        </div>
      )}

      <span className="mt-1 text-xs text-surface-400">
        {formatTime(timestamp)}
      </span>
    </div>
  );
}
