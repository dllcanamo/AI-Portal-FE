import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand,
  type Message as BedrockMessage,
  type SystemContentBlock,
  type ContentBlock,
  type ConversationRole,
  type ImageFormat,
  type DocumentFormat,
} from "@aws-sdk/client-bedrock-runtime";

/**
 * Singleton Bedrock Runtime client.
 * Uses the AWS SDK default credential provider chain, which resolves
 * credentials from (in order): env vars, SSO, shared credentials file,
 * ECS/EC2 instance metadata. No explicit credentials needed for SSO.
 */
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "ap-southeast-1",
});

export interface ChatAttachment {
  name: string;
  mimeType: string;
  base64: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
}

export interface ChatOptions {
  /** Full conversation history to send. */
  messages: ChatMessage[];
  /** Optional system prompt prepended to the conversation. */
  systemPrompt?: string;
  /** Bedrock model ID; falls back to BEDROCK_MODEL_ID env var. */
  modelId?: string;
}

const IMAGE_MIME_TO_FORMAT: Record<string, ImageFormat> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

const DOC_MIME_TO_FORMAT: Record<string, DocumentFormat> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/csv": "csv",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/html": "html",
};

/**
 * Converts a base64-encoded attachment into the appropriate Bedrock ContentBlock
 * (ImageBlock or DocumentBlock).
 */
function attachmentToContentBlock(att: ChatAttachment): ContentBlock | null {
  const bytes = Buffer.from(att.base64, "base64");

  const imageFormat = IMAGE_MIME_TO_FORMAT[att.mimeType];
  if (imageFormat) {
    return { image: { format: imageFormat, source: { bytes } } };
  }

  const docFormat = DOC_MIME_TO_FORMAT[att.mimeType];
  if (docFormat) {
    const withoutExt = att.name.replace(/\.[^.]+$/, "");
    const safeName = withoutExt
      .replace(/[^a-zA-Z0-9\s\-()\[\]]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 200) || "document";
    return { document: { format: docFormat, name: safeName, source: { bytes } } };
  }

  return null;
}

/**
 * Builds the shared Converse API parameters from ChatOptions.
 */
function buildConverseParams(opts: ChatOptions) {
  const modelId =
    opts.modelId ?? process.env.BEDROCK_MODEL_ID ?? "apac.amazon.nova-lite-v1:0";

  const messages: BedrockMessage[] = opts.messages.map((msg) => {
    const content: ContentBlock[] = [];

    if (msg.attachments?.length) {
      for (const att of msg.attachments) {
        const block = attachmentToContentBlock(att);
        if (block) content.push(block);
      }
    }

    content.push({ text: msg.content || " " });

    return { role: msg.role as ConversationRole, content };
  });

  const system: SystemContentBlock[] | undefined = opts.systemPrompt
    ? [{ text: opts.systemPrompt }]
    : undefined;

  return { modelId, messages, ...(system && { system }) };
}

/**
 * Streams a conversation to Amazon Bedrock via the ConverseStream API,
 * yielding text deltas as they arrive.
 */
export async function* chatStream(opts: ChatOptions): AsyncGenerator<string> {
  const command = new ConverseStreamCommand(buildConverseParams(opts));
  const response = await client.send(command);

  if (!response.stream) {
    throw new Error("Bedrock returned no stream");
  }

  for await (const event of response.stream) {
    if (event.contentBlockDelta?.delta?.text) {
      yield event.contentBlockDelta.delta.text;
    }
  }
}

/**
 * Sends a conversation to Amazon Bedrock via the Converse API and returns
 * the assistant's full text response. Convenience wrapper over the non-streaming API.
 */
export async function chat(opts: ChatOptions): Promise<string> {
  const command = new ConverseCommand(buildConverseParams(opts));
  const response = await client.send(command);

  const outputContent = response.output?.message?.content;
  if (!outputContent || outputContent.length === 0) {
    throw new Error("Bedrock returned an empty response");
  }

  const text = outputContent
    .map((block) => block.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Bedrock response contained no text content");
  }

  return text;
}
