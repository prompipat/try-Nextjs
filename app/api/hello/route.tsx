import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Unknown";

  return NextResponse.json({
    message: `Hello, ${name}!`,
    Timestamp: new Date().toISOString(),
    poweredBy: "Next.js API Route",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required in the request body." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Hello, ${name}! This is a response to your POST request.`,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }
}
