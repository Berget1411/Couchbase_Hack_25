import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, validateApiKey } from "@/lib/api/service";

export async function POST(request: NextRequest) {
  const { apiKey, userId } = await request.json();

  const userExists = await checkUserExists(userId);

  const keyIsValid = await validateApiKey(apiKey);

  const isValid = userExists && keyIsValid;

  return NextResponse.json({ isValid });
}
