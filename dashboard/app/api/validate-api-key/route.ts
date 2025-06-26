import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/service";
import { createAppSession } from "@/services/app-session-service";
import { getUserByApiKey } from "@/services/user-service";

export async function POST(request: NextRequest) {
  const { apiKey, appSessionName } = await request.json();

  const keyIsValid = await validateApiKey(apiKey);

  if (keyIsValid) {
    const user = await getUserByApiKey(apiKey);
    if (!user) {
      return NextResponse.json({ appSessionId: "0" });
    }

    const appSession = await createAppSession(
      user.id,
      appSessionName || "New App Session"
    );
    return NextResponse.json({ appSessionId: appSession.id });
  } else {
    return NextResponse.json({ appSessionId: "0" });
  }
}
