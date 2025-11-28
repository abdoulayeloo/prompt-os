import { NextResponse } from "next/server";
import { exampleUseCases } from "@/lib/prompt-engine";

export async function GET() {
  return NextResponse.json({
    templates: exampleUseCases.map((useCase) => ({
      id: useCase.id,
      name: useCase.label,
      body: useCase.prompt,
    })),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, body: content } = body;
  if (!name || !content) {
    return NextResponse.json(
      { error: "name et body requis" },
      { status: 400 }
    );
  }
  return NextResponse.json({
    id: crypto.randomUUID(),
    name,
    body: content,
  });
}
