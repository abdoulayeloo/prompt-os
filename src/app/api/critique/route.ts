import { NextResponse } from "next/server";
import { critiquePrompt } from "@/lib/prompt-engine";

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = body.prompt as string | undefined;

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt manquant pour la critique" },
      { status: 400 }
    );
  }

  const critique = critiquePrompt(prompt);
  return NextResponse.json({ critique });
}
