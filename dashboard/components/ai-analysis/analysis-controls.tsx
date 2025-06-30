import React from "react";
import { Button } from "@/components/ui/button";
import { QuerySelector } from "@/components/ui/query-selector";
import { UserQuery } from "@/types/request";
import { IconLoader2 } from "@tabler/icons-react";
import { Zap, CreditCard } from "lucide-react";

interface AnalysisControlsProps {
  query: UserQuery;
  onQueryChange: (query: UserQuery) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  creditCheck?: {
    freeAnalysisRemaining: number;
    paidCredits: number;
    canAnalyze: boolean;
  };
  onBuyCredits: () => void;
  disabled?: boolean;
}

export function AnalysisControls({
  query,
  onQueryChange,
  onAnalyze,
  isAnalyzing,
  canAnalyze,
  creditCheck,
  onBuyCredits,
  disabled = false,
}: AnalysisControlsProps) {
  return (
    <div className='flex flex-col gap-4 lg:flex-row lg:items-end'>
      <div className='flex-1'>
        <QuerySelector
          value={query}
          onValueChange={onQueryChange}
          placeholder='Select analysis type...'
          className='max-w-md'
        />
      </div>

      <div className='flex items-center gap-2'>
        {creditCheck && (
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Zap className='h-3 w-3' />
            {creditCheck.freeAnalysisRemaining > 0
              ? `${creditCheck.freeAnalysisRemaining} free`
              : `${creditCheck.paidCredits} credits`}
          </div>
        )}

        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || !canAnalyze || disabled}
          size='sm'
          className='w-fit'
        >
          {isAnalyzing ? (
            <>
              <IconLoader2 className='mr-2 h-3 w-3 animate-spin' />
              Analyzing...
            </>
          ) : !canAnalyze ? (
            <>
              <CreditCard className='mr-2 h-3 w-3' />
              Need Credits
            </>
          ) : (
            <>Analyze</>
          )}
        </Button>

        {!canAnalyze && (
          <Button onClick={onBuyCredits} size='sm' variant='outline'>
            <CreditCard className='mr-2 h-3 w-3' />
            Buy Credits
          </Button>
        )}
      </div>
    </div>
  );
}
