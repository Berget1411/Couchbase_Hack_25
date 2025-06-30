import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { PurchaseCreditsButton } from "../credits/purchase-credits-button";
import { useCreditStats } from "@/hooks/api/use-credits";

export function NavCreditsOverview() {
  const { data: creditStats } = useCreditStats();
  return (
    // Credits Card
    <div className='px-2 py-2'>
      <Card>
        <CardContent>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-1.5'>
              <Zap className='h-3.5 w-3.5 text-blue-600' />
              <span className='text-xs font-medium text-blue-900'>Credits</span>
            </div>
            <div className='text-xs text-blue-700 font-semibold'>
              {(creditStats?.freeAnalysisRemaining || 0) +
                (creditStats?.paidCredits || 0)}
            </div>
          </div>

          <div className='space-y-1 mb-2'>
            <div className='flex justify-between text-[10px] text-muted-foreground'>
              <span>Free: {creditStats?.freeAnalysisRemaining || 0}</span>
              <span>Paid: {creditStats?.paidCredits || 0}</span>
            </div>
            <div className='w-full bg-blue-100 rounded-full h-1.5'>
              <div
                className='bg-blue-600 h-1.5 rounded-full transition-all duration-300'
                style={{
                  width: `${Math.min(
                    100,
                    ((creditStats?.freeAnalysisUsed || 0) /
                      (creditStats?.totalFreeAnalysis || 10)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <PurchaseCreditsButton className='w-full' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
