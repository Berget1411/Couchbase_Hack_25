"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePurchaseCredits, useCreditStats } from "@/hooks/api/use-credits";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

interface CreditPurchaseProps {
  onClose?: () => void;
}

const creditPackages = [
  {
    slug: "credits-10" as const,
    credits: 10,
    price: "$3.00",

    popular: false,
  },
  {
    slug: "credits-50" as const,
    credits: 50,
    price: "$15.00",

    popular: true,
  },
  {
    slug: "credits-100" as const,
    credits: 100,
    price: "$30.00",

    popular: false,
  },
];

export function CreditPurchase({ onClose }: CreditPurchaseProps) {
  const { data: stats } = useCreditStats();
  const purchaseCredits = usePurchaseCredits();

  const handlePurchase = async (
    packageSlug: (typeof creditPackages)[0]["slug"]
  ) => {
    try {
      await purchaseCredits.mutateAsync(packageSlug);
      toast.success("Redirecting to checkout...");
      onClose?.();
    } catch (error) {
      console.error("Purchase failed:", error);
      if (error instanceof Error && error.message.includes("404")) {
        toast.error("Credit packages not configured. Please contact support.");
      } else {
        toast.error("Failed to initiate purchase. Please try again.");
      }
    }
  };

  return (
    <div className='space-y-6 px-4'>
      {/* Current Credits Status */}
      <Card className=''>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Zap className='h-5 w-5 text-blue-600' />
            Your AI Analysis Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <div className='text-muted-foreground'>Free Remaining</div>
              <div className='text-2xl font-bold text-blue-600'>
                {stats?.freeAnalysisRemaining || 0}
              </div>
            </div>
            <div>
              <div className='text-muted-foreground'>Paid Credits</div>
              <div className='text-2xl font-bold text-green-600'>
                {stats?.paidCredits || 0}
              </div>
            </div>
          </div>
          <div className='mt-3 text-xs text-muted-foreground'>
            Total Analysis Performed: {stats?.totalAnalysisCount || 0}
          </div>
        </CardContent>
      </Card>

      {/* Purchase Options */}
      <div className='space-y-4'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold'>
            Purchase AI Analysis Credits
          </h3>
          <p className='text-sm text-muted-foreground'>
            Each credit allows one AI analysis session ($0.30 per analysis)
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          {creditPackages.map((pkg) => (
            <Card
              key={pkg.slug}
              className={`relative transition-all hover:shadow-md ${
                pkg.popular ? "border-blue-500 shadow-md" : ""
              }`}
            >
              {pkg.popular && (
                <Badge className='absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500'>
                  Most Popular
                </Badge>
              )}

              <CardHeader className='text-center pb-3'>
                <CardTitle className='text-lg'>{pkg.credits} Credits</CardTitle>
                <div className='text-2xl font-bold text-green-600'>
                  {pkg.price}
                </div>
              </CardHeader>

              <CardContent className='pt-0'>
                <div className='space-y-3'>
                  <div className='text-xs text-muted-foreground text-center'>
                    $
                    {(
                      parseFloat(pkg.price.replace("$", "")) / pkg.credits
                    ).toFixed(2)}{" "}
                    per analysis
                  </div>

                  <Button
                    className='w-full'
                    onClick={() => handlePurchase(pkg.slug)}
                    disabled={purchaseCredits.isPending}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    {purchaseCredits.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Processing...
                      </>
                    ) : (
                      <>Purchase</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='text-center text-xs text-muted-foreground'>
          <p>Secure payment powered by Polar.sh • No subscription required</p>
          <p>Credits never expire and can be used for any AI analysis</p>
        </div>
      </div>
    </div>
  );
}
