"use client";

import { useState, useRef, useCallback, FormEvent, DragEvent } from "react";
import { Send, Paperclip, Image as ImageIcon, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/lib/types";
import {
  validateFile,
  validateAttachmentCount,
  fileToAttachment,
  formatFileSize,
  getImageAcceptString,
  getFileAcceptString,
  MAX_ATTACHMENTS,
} from "@/lib/file-validation";

interface ChatInputProps {
  /** Called when the user sends a message with optional attachments. */
  onSend: (message: string, attachments: Attachment[]) => void;
  /** When true, disables the input and all buttons. */
  disabled?: boolean;
}

/**
 * Chat input form with text field, file/image upload buttons, drag-and-drop zone,
 * attachment preview strip, and send button. Validates files against type and size
 * restrictions before attaching.
 */
export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Processes selected files: validates each, converts to Attachment, and
   * appends to the current list. Shows the first validation error encountered.
   */
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      const countResult = validateAttachmentCount(attachments.length, fileArray.length);
      if (!countResult.valid) {
        setError(countResult.error ?? null);
        return;
      }

      const newAttachments: Attachment[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file);
        if (!validation.valid) {
          setError(validation.error ?? null);
          continue;
        }

        const attachment = fileToAttachment(file);
        if (attachment) {
          newAttachments.push(attachment);
        }
      }

      if (newAttachments.length > 0) {
        setAttachments((prev) => [...prev, ...newAttachments]);
      }
    },
    [attachments.length]
  );

  /**
   * Removes an attachment by ID and revokes its object URL to free memory.
   */
  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((a) => a.id !== id);
    });
    setError(null);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && attachments.length === 0) || disabled) return;

    onSend(trimmed, attachments);
    setValue("");
    setAttachments([]);
    setError(null);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    e.target.value = "";
  };

  const canSend = (value.trim() || attachments.length > 0) && !disabled;

  return (
    <div className="space-y-2">
      {/* Error feedback */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Attachment preview strip */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="group relative flex items-center gap-2 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm"
            >
              {att.attachmentType === "image" ? (
                <img
                  src={att.url}
                  alt={att.name}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-50 text-primary-600">
                  <FileText size={18} />
                </div>
              )}
              <div className="max-w-[120px]">
                <p className="truncate text-xs font-medium text-surface-700">
                  {att.name}
                </p>
                <p className="text-xs text-surface-400">
                  {formatFileSize(att.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface-700 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${att.name}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <span className="self-center text-xs text-surface-400">
            {attachments.length}/{MAX_ATTACHMENTS}
          </span>
        </div>
      )}

      {/* Input row with drag-and-drop zone */}
      <form
        onSubmit={handleSubmit}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-row items-end gap-2 rounded-lg border-2 border-transparent p-1 transition-colors",
          isDragOver && "border-primary-400 bg-primary-50/50"
        )}
      >
        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept={getImageAcceptString()}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={getFileAcceptString()}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden
        />

        {/* Action buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled || attachments.length >= MAX_ATTACHMENTS}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-surface-400 transition-colors",
              "hover:bg-surface-100 hover:text-surface-600",
              "disabled:cursor-not-allowed disabled:opacity-40"
            )}
            title="Attach image (JPG, PNG, GIF, WebP — max 5 MB)"
            aria-label="Attach image"
          >
            <ImageIcon size={20} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || attachments.length >= MAX_ATTACHMENTS}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-surface-400 transition-colors",
              "hover:bg-surface-100 hover:text-surface-600",
              "disabled:cursor-not-allowed disabled:opacity-40"
            )}
            title="Attach file (PDF, TXT, CSV, JSON, MD, DOCX, XLSX — max 10 MB)"
            aria-label="Attach file"
          >
            <Paperclip size={20} />
          </button>
        </div>

        {/* Text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isDragOver ? "Drop files here..." : "Type your message..."}
          disabled={disabled}
          className={cn(
            "flex-1 rounded-lg border border-surface-200 bg-white px-4 py-3 text-surface-900 placeholder:text-surface-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          className={cn(
            "flex h-[46px] items-center justify-center rounded-lg bg-primary-600 px-4 text-white",
            "hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      {/* Format hint */}
      {isDragOver && (
        <p className="text-center text-xs text-primary-500">
          Drop images or files to attach
        </p>
      )}
    </div>
  );
}
