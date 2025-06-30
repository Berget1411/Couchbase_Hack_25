import { NextResponse } from "next/server";
import { getStoryContent } from "@/lib/markdown";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = getStoryContent();
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error reading story content:", error);
    return NextResponse.json(
      { error: "Failed to load story content" },
      { status: 500 }
    );
  }
}
