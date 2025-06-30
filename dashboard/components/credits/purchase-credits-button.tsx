import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreditCard } from "lucide-react";
import { CreditPurchase } from "./credit-purchase";

export function PurchaseCreditsButton({ className }: { className?: string }) {
  return (
    // Action Buttons
    <div className='flex gap-2 pt-2'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='sm' className={className}>
            <CreditCard className='h-4 w-4 mr-2' />
            Purchase More
          </Button>
        </SheetTrigger>
        <SheetContent className='sm:max-w-lg'>
          <SheetHeader>
            <SheetTitle>Purchase AI Analysis Credits</SheetTitle>
            <SheetDescription>
              Get more credits to continue analyzing your code with AI.
            </SheetDescription>
          </SheetHeader>
          <div className='mt-6'>
            <CreditPurchase />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
