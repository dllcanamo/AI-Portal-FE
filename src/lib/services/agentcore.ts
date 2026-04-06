import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";

/**
 * Singleton AgentCore client.
 * Uses the AWS SDK default credential provider chain (SSO, env vars, etc.).
 */
const client = new BedrockAgentCoreClient({
  region: process.env.AWS_REGION ?? "ap-southeast-1",
});

export interface A2AInvokeOptions {
  /** AgentCore Runtime ARN of the target A2A agent. */
  agentRuntimeArn: string;
  /** User's message text to send to the agent. */
  prompt: string;
  /** Optional session ID for multi-turn conversations. */
  sessionId?: string;
  /** Optional endpoint qualifier. */
  qualifier?: string;
}

/**
 * Invokes an AgentCore A2A agent and yields response text chunks as they stream in.
 */
export async function* invokeA2AStream(
  opts: A2AInvokeOptions,
): AsyncGenerator<string> {
  const payload = JSON.stringify({ prompt: opts.prompt });

  const command = new InvokeAgentRuntimeCommand({
    agentRuntimeArn: opts.agentRuntimeArn,
    payload: new TextEncoder().encode(payload),
    ...(opts.sessionId && { runtimeSessionId: opts.sessionId }),
    ...(opts.qualifier && { qualifier: opts.qualifier }),
  });

  const response = await client.send(command);

  if (!response.response) {
    throw new Error("AgentCore returned no response body");
  }

  const contentType = response.contentType ?? "";

  if (contentType.includes("text/event-stream")) {
    const decoder = new TextDecoder();
    const stream = response.response as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      const text = decoder.decode(chunk, { stream: true });
      for (const line of text.split("\n")) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data && data !== "[DONE]") {
            yield data;
          }
        }
      }
    }
  } else {
    const chunks: Uint8Array[] = [];
    const stream = response.response as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const fullText = new TextDecoder().decode(
      Buffer.concat(chunks),
    );

    try {
      const parsed = JSON.parse(fullText);
      yield typeof parsed === "string" ? parsed : JSON.stringify(parsed);
    } catch {
      yield fullText;
    }
  }
}
