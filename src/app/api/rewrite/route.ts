import { NextResponse } from "next/server";
import { critiquePrompt, optimizePrompt } from "@/lib/prompt-engine";

type VariantPayload = {
  id: string;
  content: string;
  type?: "safe" | "balanced" | "aggressive";
};

export async function POST(req: Request) {
  const body = await req.json();
  const variant = body.variant as VariantPayload | undefined;

  if (!variant?.content) {
    return NextResponse.json(
      { error: "Variante manquante pour la réécriture" },
      { status: 400 }
    );
  }

  const critique = critiquePrompt(variant.content);
  const optimized = optimizePrompt(
    {
      id: variant.id,
      type: variant.type || "balanced",
      title: "Optimisé",
      content: variant.content,
      score: 0,
      rationale: "",
    },
    critique
  );

  return NextResponse.json({
    optimized,
    critique,
  });
}
