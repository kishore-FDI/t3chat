import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { message, model } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    const geminiModel = getGeminiModel(model);
    const result = await geminiModel.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
