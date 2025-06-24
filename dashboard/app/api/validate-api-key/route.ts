import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/service";

export async function POST(request: NextRequest) {
  const { apiKey } = await request.json();

  const keyIsValid = await validateApiKey(apiKey);

  return NextResponse.json({ keyIsValid });
}
