import { prisma } from "@/lib/prisma";

const FREE_ANALYSIS_LIMIT = 10;
const ANALYSIS_COST_CREDITS = 1; // Each analysis costs 1 credit (equivalent to $0.30)

export interface CreditCheckResult {
  canAnalyze: boolean;
  freeAnalysisRemaining: number;
  paidCredits: number;
  totalAnalysisCount: number;
  needsPayment: boolean;
}

export class CreditService {
  /**
   * Check if user has enough credits for analysis
   */
  static async checkUserCredits(userId: string): Promise<CreditCheckResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        freeAnalysisUsed: true,
        paidCredits: true,
        totalAnalysisCount: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const freeAnalysisRemaining = Math.max(
      0,
      FREE_ANALYSIS_LIMIT - user.freeAnalysisUsed
    );
    const hasCredits = freeAnalysisRemaining > 0 || user.paidCredits > 0;

    return {
      canAnalyze: hasCredits,
      freeAnalysisRemaining,
      paidCredits: user.paidCredits,
      totalAnalysisCount: user.totalAnalysisCount,
      needsPayment: freeAnalysisRemaining === 0 && user.paidCredits === 0,
    };
  }

  /**
   * Consume credits for an analysis
   */
  static async consumeCredits(
    userId: string,
    repoUrl: string,
    query: string,
    requestCount: number
  ): Promise<{ success: boolean; wasFree: boolean }> {
    const creditCheck = await this.checkUserCredits(userId);

    if (!creditCheck.canAnalyze) {
      throw new Error("Insufficient credits for analysis");
    }

    const wasFree = creditCheck.freeAnalysisRemaining > 0;

    // Update user credits in a transaction
    await prisma.$transaction(async (tx) => {
      // Update user credits
      if (wasFree) {
        await tx.user.update({
          where: { id: userId },
          data: {
            freeAnalysisUsed: { increment: 1 },
            totalAnalysisCount: { increment: 1 },
          },
        });
      } else {
        await tx.user.update({
          where: { id: userId },
          data: {
            paidCredits: { decrement: ANALYSIS_COST_CREDITS },
            totalAnalysisCount: { increment: 1 },
          },
        });
      }

      // Record analysis history
      await tx.analysisHistory.create({
        data: {
          userId,
          repoUrl,
          query: typeof query === "object" ? JSON.stringify(query) : query,
          requestCount,
          wasFree,
          creditsUsed: ANALYSIS_COST_CREDITS,
        },
      });
    });

    return { success: true, wasFree };
  }

  /**
   * Add paid credits to user account
   */
  static async addCredits(userId: string, credits: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        paidCredits: { increment: credits },
      },
    });
  }

  /**
   * Get user's analysis history
   */
  static async getAnalysisHistory(userId: string, limit = 50) {
    return await prisma.analysisHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Get credit statistics for user
   */
  static async getCreditStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        freeAnalysisUsed: true,
        paidCredits: true,
        totalAnalysisCount: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const totalFreeAnalysis = FREE_ANALYSIS_LIMIT;
    const freeAnalysisRemaining = Math.max(
      0,
      totalFreeAnalysis - user.freeAnalysisUsed
    );

    return {
      totalFreeAnalysis,
      freeAnalysisUsed: user.freeAnalysisUsed,
      freeAnalysisRemaining,
      paidCredits: user.paidCredits,
      totalAnalysisCount: user.totalAnalysisCount,
    };
  }
}
