import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { promptId, target } = body;

  if (!promptId || !target) {
    return NextResponse.json(
      { error: "promptId et target requis" },
      { status: 400 }
    );
  }

  const link = `https://api.promptfoundry.dev/export/${promptId}?target=${encodeURIComponent(
    target
  )}`;

  return NextResponse.json({
    link,
    status: "ready",
  });
}
