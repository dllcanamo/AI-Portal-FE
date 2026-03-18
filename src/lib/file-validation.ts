import type { Attachment, AttachmentType } from "./types";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const ALLOWED_FILE_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "text/plain": ".txt",
  "text/csv": ".csv",
  "application/json": ".json",
  "text/markdown": ".md",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
};

const ALL_ALLOWED_TYPES = { ...ALLOWED_IMAGE_TYPES, ...ALLOWED_FILE_TYPES };

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_ATTACHMENTS = 5;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Sanitizes a filename by stripping path traversal sequences, control characters,
 * and any characters that could enable injection attacks.
 */
export function sanitizeFilename(name: string): string {
  let sanitized = name.replace(/[/\\]/g, "");
  sanitized = sanitized.replace(/\.\./g, "");
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, "");
  sanitized = sanitized.trim().replace(/^\.+/, "");

  if (!sanitized) {
    sanitized = "unnamed-file";
  }

  if (sanitized.length > 200) {
    const ext = sanitized.lastIndexOf(".");
    if (ext > 0) {
      sanitized = sanitized.slice(0, 196) + sanitized.slice(ext);
    } else {
      sanitized = sanitized.slice(0, 200);
    }
  }

  return sanitized;
}

/**
 * Determines whether a MIME type corresponds to an image or generic file.
 */
export function classifyFile(mimeType: string): AttachmentType {
  return mimeType in ALLOWED_IMAGE_TYPES ? "image" : "file";
}

/**
 * Validates a single file against allowed types and size limits.
 * Returns a result object indicating validity and an optional error message.
 */
export function validateFile(file: File): ValidationResult {
  if (!ALL_ALLOWED_TYPES[file.type]) {
    const allowed = [
      ...Object.values(ALLOWED_IMAGE_TYPES),
      ...Object.values(ALLOWED_FILE_TYPES),
    ].join(", ");
    return {
      valid: false,
      error: `"${sanitizeFilename(file.name)}" is not a supported format. Allowed: ${allowed}`,
    };
  }

  const isImage = file.type in ALLOWED_IMAGE_TYPES;
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
  const maxLabel = isImage ? "5 MB" : "10 MB";

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `"${sanitizeFilename(file.name)}" exceeds the ${maxLabel} size limit.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: `"${sanitizeFilename(file.name)}" is empty.` };
  }

  return { valid: true };
}

/**
 * Validates the total count of attachments (existing + new) against the maximum.
 */
export function validateAttachmentCount(
  currentCount: number,
  newCount: number
): ValidationResult {
  if (currentCount + newCount > MAX_ATTACHMENTS) {
    return {
      valid: false,
      error: `You can attach up to ${MAX_ATTACHMENTS} files at a time. Remove some to add more.`,
    };
  }
  return { valid: true };
}

/**
 * Processes a raw File into a validated Attachment with a sanitized name
 * and a revocable object URL for preview. Returns null if validation fails.
 */
export function fileToAttachment(file: File): Attachment | null {
  const result = validateFile(file);
  if (!result.valid) return null;

  return {
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: sanitizeFilename(file.name),
    size: file.size,
    mimeType: file.type,
    attachmentType: classifyFile(file.type),
    url: URL.createObjectURL(file),
  };
}

/**
 * Formats a byte count into a human-readable string (e.g. "2.4 MB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Returns the accept string for file inputs based on all allowed MIME types.
 */
export function getImageAcceptString(): string {
  return Object.keys(ALLOWED_IMAGE_TYPES).join(",");
}

/**
 * Returns the accept string for document file inputs.
 */
export function getFileAcceptString(): string {
  return Object.keys(ALLOWED_FILE_TYPES).join(",");
}

/**
 * Returns the combined accept string for all allowed file types.
 */
export function getAllAcceptString(): string {
  return Object.keys(ALL_ALLOWED_TYPES).join(",");
}

export { MAX_ATTACHMENTS, MAX_IMAGE_SIZE, MAX_FILE_SIZE };
