"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSendAiRequest } from "@/hooks/api/backend/use-send-ai-request";
import { useTableContext } from "@/components/provider/table-provider";
import { UserQuery, PREDEFINED_QUERIES, RequestData } from "@/types/request";
import { Github } from "lucide-react";
import { useCheckCredits } from "@/hooks/api/use-credits";
import { AnalysisHeader } from "./analysis-header";
import { AnalysisControls } from "./analysis-controls";
import { AnalysisResult } from "./analysis-result";
import { CreditPurchaseModal } from "./credit-purchase-modal";

// Type for AI analysis response
interface AnalysisResponse {
  question_rephrase?: string;
  proposed_fix?: string;
  error?: string;
}

interface AiAnalysisProps {
  repoUrl?: string;
}

// Helper function to format the AI analysis result for better UX
const formatAnalysisResult = (
  data: AnalysisResponse,
  selectedRows: RequestData[]
) => {
  // Extract request summary
  const requestSummary = selectedRows
    .map((req, index) => {
      const flagText =
        req.flag === 0
          ? "✅ Good"
          : req.flag === 1
          ? "⚠️ Flagged"
          : "🚫 Blocked";
      return `${index + 1}. ${req.method} ${req.requestData} (${flagText})`;
    })
    .join("\n");

  // Format the response
  return `📋 ANALYSIS SUMMARY
${data.question_rephrase || "No analysis available"}

🔍 REQUESTS ANALYZED (${selectedRows.length} total):
${requestSummary}

💡 FINDINGS & RECOMMENDATIONS:
${data.proposed_fix || "No specific recommendations available"}

${data.error ? `❌ ERROR: ${data.error}` : ""}`.trim();
};

export function AiAnalysis({ repoUrl }: AiAnalysisProps) {
  const { selectedRows } = useTableContext();
  const [query, setQuery] = useState<UserQuery>(
    PREDEFINED_QUERIES.EXPLAIN_REQUESTS
  );
  const [result, setResult] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCreditPurchase, setShowCreditPurchase] = useState(false);

  const { mutate: sendAiRequest, isPending } = useSendAiRequest();
  const { data: creditCheck, refetch: refetchCredits } = useCheckCredits();

  const handleAnalyze = async () => {
    if (!repoUrl) {
      alert("Please connect a repository first to analyze requests.");
      return;
    }

    if (selectedRows.length === 0) {
      alert("Please select at least one row to analyze.");
      return;
    }

    // Check if user has enough credits
    if (creditCheck && !creditCheck.canAnalyze) {
      setShowCreditPurchase(true);
      return;
    }

    // Consume credits first
    try {
      const consumeResponse = await fetch("/api/credits/consume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          repoUrl: repoUrl,
          query: typeof query === "object" ? JSON.stringify(query) : query,
          requestCount: selectedRows.length,
        }),
      });

      if (!consumeResponse.ok) {
        if (consumeResponse.status === 402) {
          // Payment required
          setShowCreditPurchase(true);
          return;
        }
        throw new Error("Failed to consume credits");
      }

      const consumeData = await consumeResponse.json();

      // Refetch credit status
      refetchCredits();

      // Now proceed with AI analysis
      sendAiRequest(
        {
          repo_url: repoUrl,
          user_query: query,
          input_requests: selectedRows,
        },
        {
          onSuccess: (data) => {
            // Format the response for better user experience
            const formattedResult = formatAnalysisResult(
              data as AnalysisResponse,
              selectedRows
            );
            setResult(formattedResult);

            // Show credit usage info
            if (consumeData.wasFree) {
              console.log("Used free analysis credit");
            } else {
              console.log("Used paid analysis credit");
            }
          },
          onError: (error) => {
            console.error("AI analysis failed:", error);
            setResult("Analysis failed. Please try again.");
          },
        }
      );
    } catch (error) {
      console.error("Credit consumption failed:", error);
      alert("Failed to process credits. Please try again.");
    }
  };

  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <div className='relative overflow-hidden rounded-lg border bg-background'>
      {/* Dark overlay when no repo is connected */}
      {!repoUrl && (
        <div className='absolute inset-0 bg-black/50 z-10 flex items-center justify-center'>
          <div className='text-center space-y-4'>
            <Button size='lg' className='shadow-lg' disabled>
              <Github className='mr-2 h-5 w-5' />
              Connect GitHub Repository Required
            </Button>
            <p className='text-sm text-white'>
              Use the repository selector above to connect a repository first
            </p>
          </div>
        </div>
      )}

      {/* Main AI Analysis Content (darkened when no repo) */}
      <div className={!repoUrl ? "opacity-30 pointer-events-none" : ""}>
        <AnalysisHeader
          selectedRowCount={selectedRows.length}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded(!isExpanded)}
          creditCheck={creditCheck}
        />

        <div
          className={`border-t px-4 lg:px-6 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-screen py-4" : "max-h-0 py-0"
          }`}
        >
          <AnalysisControls
            query={query}
            onQueryChange={setQuery}
            onAnalyze={handleAnalyze}
            isAnalyzing={isPending}
            canAnalyze={creditCheck?.canAnalyze ?? false}
            creditCheck={creditCheck}
            onBuyCredits={() => setShowCreditPurchase(true)}
            disabled={!repoUrl || selectedRows.length === 0}
          />

          <AnalysisResult result={result} />
        </div>
      </div>

      {/* Credit Purchase Modal */}
      <CreditPurchaseModal
        isOpen={showCreditPurchase}
        onClose={() => setShowCreditPurchase(false)}
      />
    </div>
  );
}
