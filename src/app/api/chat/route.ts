import { NextRequest, NextResponse } from "next/server";
import { getAgentById } from "@/config/agents";
import { chatStream } from "@/lib/services/bedrock";
import { invokeA2AStream } from "@/lib/services/agentcore";

interface ChatAttachmentPayload {
  name: string;
  mimeType: string;
  base64: string;
}

interface ChatRequestBody {
  agentId: string;
  messages: {
    role: "user" | "assistant";
    content: string;
    attachments?: ChatAttachmentPayload[];
  }[];
  sessionId?: string;
}

/**
 * Pipes an async generator of text chunks into an SSE-formatted ReadableStream.
 * Each chunk is sent as `data: <text>\n\n`. A `data: [DONE]\n\n` sentinel
 * is emitted when the generator is exhausted.
 */
function generatorToSSEStream(gen: AsyncGenerator<string>): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await gen.next();
        if (done) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } else {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(value)}\n\n`));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${JSON.stringify(message)}\n\n`),
        );
        controller.close();
      }
    },
    cancel() {
      gen.return(undefined);
    },
  });
}

/**
 * POST /api/chat -- Streams chat responses via SSE.
 * Routes to Bedrock ConverseStream or AgentCore A2A based on the agent's
 * configured backend.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;

    if (
      !body.agentId ||
      !Array.isArray(body.messages) ||
      body.messages.length === 0
    ) {
      return NextResponse.json(
        { error: "agentId and a non-empty messages array are required" },
        { status: 400 },
      );
    }

    const agent = getAgentById(body.agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    let stream: AsyncGenerator<string>;

    switch (agent.backend) {
      case "agentcore-a2a": {
        const arn =
          agent.agentRuntimeArn ?? process.env.AGENTCORE_AGENT_RUNTIME_ARN;
        if (!arn) {
          return NextResponse.json(
            { error: "Agent is missing agentRuntimeArn — set AGENTCORE_AGENT_RUNTIME_ARN in .env.local" },
            { status: 500 },
          );
        }
        const lastUserMsg = [...body.messages].reverse().find((m) => m.role === "user");
        stream = invokeA2AStream({
          agentRuntimeArn: arn,
          prompt: lastUserMsg?.content ?? "",
          sessionId: body.sessionId,
          qualifier: agent.agentRuntimeQualifier,
        });
        break;
      }
      case "bedrock":
      default: {
        stream = chatStream({
          messages: body.messages.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          systemPrompt: agent.systemPrompt,
          modelId: agent.modelId,
        });
        break;
      }
    }

    return new Response(generatorToSSEStream(stream), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("[/api/chat] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
