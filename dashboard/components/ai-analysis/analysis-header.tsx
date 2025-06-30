import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Zap } from "lucide-react";

interface AnalysisHeaderProps {
  selectedRowCount: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  creditCheck?: {
    freeAnalysisRemaining: number;
    paidCredits: number;
    canAnalyze: boolean;
  };
}

export function AnalysisHeader({
  selectedRowCount,
  isExpanded,
  onToggleExpanded,
  creditCheck,
}: AnalysisHeaderProps) {
  return (
    <div className='flex items-center justify-between px-4 py-3 lg:px-6'>
      <div className='flex items-center gap-2'>
        <h3 className='text-sm font-medium'>AI Analysis</h3>
        <Badge variant='secondary' className='text-xs'>
          {selectedRowCount} {selectedRowCount === 1 ? "row" : "rows"} selected
        </Badge>
        {creditCheck && (
          <Badge variant='outline' className='text-xs flex items-center gap-1'>
            <Zap className='h-3 w-3' />
            {creditCheck.freeAnalysisRemaining > 0
              ? `${creditCheck.freeAnalysisRemaining} free`
              : `${creditCheck.paidCredits} credits`}
          </Badge>
        )}
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={onToggleExpanded}
        className='h-8 w-8 p-0 hover:bg-muted'
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </Button>
    </div>
  );
}
