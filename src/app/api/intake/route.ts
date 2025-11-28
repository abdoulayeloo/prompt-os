import { NextResponse } from "next/server";
import {
  generateVariants,
  promptIntakeSchema,
  scorePrompt,
} from "@/lib/prompt-engine";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = promptIntakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const variants = generateVariants(parsed.data).map((variant) => ({
    ...variant,
    scoring: scorePrompt(variant.content),
  }));

  return NextResponse.json({
    draftId: crypto.randomUUID(),
    variants,
  });
}
