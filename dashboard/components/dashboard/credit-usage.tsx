import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, CreditCard, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PurchaseCreditsButton } from "../credits/purchase-credits-button";
import { useCreditStats } from "@/hooks/api/use-credits";

export function CreditUsage() {
  const { data: creditStats } = useCreditStats();
  return (
    // Usage Status
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          Usage Summary
        </CardTitle>
        <CardDescription>
          Your AI analysis credit usage and status
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Credit Status */}
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>Credit Status</span>
          <div className='flex items-center gap-2'>
            {(creditStats?.freeAnalysisRemaining || 0) > 0 ? (
              <Badge variant='default' className='bg-blue-100 text-blue-800'>
                <Zap className='h-3 w-3 mr-1' />
                Using Free Credits
              </Badge>
            ) : (creditStats?.paidCredits || 0) > 0 ? (
              <Badge variant='default' className='bg-green-100 text-green-800'>
                <CreditCard className='h-3 w-3 mr-1' />
                Using Paid Credits
              </Badge>
            ) : (
              <Badge variant='destructive'>No Credits Available</Badge>
            )}
          </div>
        </div>

        {/* Progress Bars */}
        <div className='space-y-3'>
          {/* Free Credits Progress */}
          <div className='space-y-1'>
            <div className='flex justify-between text-sm'>
              <span>Free Credits Used</span>
              <span className='text-muted-foreground'>
                {creditStats?.freeAnalysisUsed || 0} /{" "}
                {creditStats?.totalFreeAnalysis || 10}
              </span>
            </div>
            <div className='w-full bg-muted rounded-full h-2'>
              <div
                className='bg-blue-600 h-2 rounded-full transition-all duration-300'
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

          {/* Paid Credits Info */}
          {(creditStats?.paidCredits || 0) > 0 && (
            <div className='flex justify-between text-sm'>
              <span>Paid Credits Available</span>
              <span className='font-medium text-green-600'>
                {creditStats?.paidCredits} credits
              </span>
            </div>
          )}
        </div>

        <PurchaseCreditsButton />
      </CardContent>
    </Card>
  );
}
