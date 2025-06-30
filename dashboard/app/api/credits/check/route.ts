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

    const creditResult = await CreditService.checkUserCredits(session.user.id);

    return NextResponse.json(creditResult);
  } catch (error) {
    console.error("Error checking credits:", error);
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
}
