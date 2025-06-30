import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { CreditService } from "@/services/credit-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await CreditService.getCreditStats(session.user.id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error getting credit stats:", error);
    return NextResponse.json(
      { error: "Failed to get credit stats" },
      { status: 500 }
    );
  }
}
