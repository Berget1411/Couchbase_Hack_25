import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { CreditService } from "@/services/credit-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoUrl, query, requestCount } = await request.json();

    if (!repoUrl || !query || typeof requestCount !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: repoUrl, query, requestCount" },
        { status: 400 }
      );
    }

    // Check if user has enough credits
    const creditCheck = await CreditService.checkUserCredits(session.user.id);

    if (!creditCheck.canAnalyze) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          needsPayment: creditCheck.needsPayment,
          freeAnalysisRemaining: creditCheck.freeAnalysisRemaining,
          paidCredits: creditCheck.paidCredits,
        },
        { status: 402 } // Payment Required
      );
    }

    // Consume credits
    const result = await CreditService.consumeCredits(
      session.user.id,
      repoUrl,
      query,
      requestCount
    );

    return NextResponse.json({
      success: true,
      wasFree: result.wasFree,
      remainingCredits:
        creditCheck.freeAnalysisRemaining + creditCheck.paidCredits - 1,
    });
  } catch (error) {
    console.error("Error consuming credits:", error);

    if (
      error instanceof Error &&
      error.message === "Insufficient credits for analysis"
    ) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "Failed to consume credits" },
      { status: 500 }
    );
  }
}
