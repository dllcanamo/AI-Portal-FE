import { NextResponse } from "next/server";
import {
  BedrockClient,
  ListFoundationModelsCommand,
} from "@aws-sdk/client-bedrock";

const bedrock = new BedrockClient({
  region: process.env.AWS_REGION ?? "ap-southeast-1",
});

/**
 * GET /api/health -- Verifies that AWS credentials (SSO) are valid and
 * Bedrock is reachable by listing a single foundation model.
 */
export async function GET() {
  try {
    const command = new ListFoundationModelsCommand({
      byOutputModality: "TEXT",
    });
    const response = await bedrock.send(command);

    const modelCount = response.modelSummaries?.length ?? 0;

    return NextResponse.json({
      status: "ok",
      region: process.env.AWS_REGION ?? "ap-southeast-1",
      modelsAvailable: modelCount,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/health] Bedrock connectivity check failed:", message);

    return NextResponse.json(
      {
        status: "error",
        message,
        hint: "Run 'aws sso login --profile AWSAdministratorAccess-069306857192' to refresh your session.",
      },
      { status: 503 }
    );
  }
}
