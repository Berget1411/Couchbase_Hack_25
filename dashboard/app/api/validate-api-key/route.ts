import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/service";
import { createAppSession } from "@/lib/api/dashboard/app-session-fetch";
import { getUserByApiKey } from "@/services/user-service";

export async function POST(request: NextRequest) {
  const { apiKey } = await request.json();

  const keyIsValid = await validateApiKey(apiKey);

  if (keyIsValid) {
    const user = await getUserByApiKey(apiKey);
    if (!user) {
      return NextResponse.json({ appSessionId: "0" });
    }

    const appSession = await createAppSession(user.id);
    return NextResponse.json({ appSessionId: appSession.id });
  } else {
    return NextResponse.json({ appSessionId: "0" });
  }
}
