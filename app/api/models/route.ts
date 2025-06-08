import { NextResponse } from "next/server";

interface GoogleAIModel {
  name: string;
  displayName?: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods?: string[];
}

interface GoogleAIResponse {
  models: GoogleAIModel[];
}

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as GoogleAIResponse;

    // Transform the API response to match our frontend format
    const models = data.models
      .filter((model) => model.name.startsWith("models/gemini"))
      .map((model) => ({
        value: model.name.replace("models/", ""),
        label: model.displayName || model.name.replace("models/", ""),
      }));

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
