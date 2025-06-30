import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface CreditCheckResult {
  canAnalyze: boolean;
  freeAnalysisRemaining: number;
  paidCredits: number;
  totalAnalysisCount: number;
  needsPayment: boolean;
}

interface CreditStats {
  totalFreeAnalysis: number;
  freeAnalysisUsed: number;
  freeAnalysisRemaining: number;
  paidCredits: number;
  totalAnalysisCount: number;
}

// Check if user can perform analysis
export const useCheckCredits = () => {
  return useQuery<CreditCheckResult>({
    queryKey: ["credits", "check"],
    queryFn: async () => {
      const response = await fetch("/api/credits/check", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to check credits");
      }
      return response.json();
    },
  });
};

// Get detailed credit statistics
export const useCreditStats = () => {
  return useQuery<CreditStats>({
    queryKey: ["credits", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/credits/stats", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to get credit stats");
      }
      return response.json();
    },
  });
};

// Initiate checkout for credit packages
export const usePurchaseCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      creditPackage: "credits-10" | "credits-50" | "credits-100"
    ) => {
      // Use Better Auth's Polar checkout integration
      return await authClient.checkout({
        slug: creditPackage,
      });
    },
    onSuccess: () => {
      // Invalidate credit queries after successful purchase initiation
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};

// Refresh credits (useful after successful payment)
export const useRefreshCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Just invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["credits"] });
      return true;
    },
  });
};
