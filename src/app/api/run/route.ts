import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { promptId, model } = body;

  if (!promptId || !model) {
    return NextResponse.json(
      { error: "promptId et model requis" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    output:
      "Sortie simulée. Ici nous exécuterions le prompt contre le modèle choisi.",
    model,
    costUsd: 0.001,
    latencyMs: 1800,
  });
}
