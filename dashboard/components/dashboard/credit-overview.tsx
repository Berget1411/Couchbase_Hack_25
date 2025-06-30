import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, Zap } from "lucide-react";
import { useCreditStats } from "@/hooks/api/use-credits";

export function CreditOverview() {
  const { data: creditStats } = useCreditStats();
  return (
    // Credit Overview Cards
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Free Credits */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Free Credits</CardTitle>
          <Zap className='h-4 w-4 text-blue-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-blue-600'>
            {creditStats?.freeAnalysisRemaining || 0}
          </div>
          <p className='text-xs text-muted-foreground'>
            of {creditStats?.totalFreeAnalysis || 10} remaining
          </p>
        </CardContent>
      </Card>

      {/* Paid Credits */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Paid Credits</CardTitle>
          <CreditCard className='h-4 w-4 text-green-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>
            {creditStats?.paidCredits || 0}
          </div>
          <p className='text-xs text-muted-foreground'>Never expire</p>
        </CardContent>
      </Card>

      {/* Total Usage */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Analyses</CardTitle>
          <TrendingUp className='h-4 w-4 text-purple-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {creditStats?.totalAnalysisCount || 0}
          </div>
          <p className='text-xs text-muted-foreground'>All time</p>
        </CardContent>
      </Card>
    </div>
  );
}
