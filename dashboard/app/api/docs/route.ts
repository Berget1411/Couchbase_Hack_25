import { NextResponse } from "next/server";
import { getDocsContent } from "@/lib/markdown";

export async function GET() {
  try {
    const content = getDocsContent();
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error reading docs content:", error);
    return NextResponse.json(
      { error: "Failed to load docs content" },
      { status: 500 }
    );
  }
}
