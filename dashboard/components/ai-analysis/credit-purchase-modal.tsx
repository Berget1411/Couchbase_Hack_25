import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CreditPurchase } from "@/components/credits/credit-purchase";

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditPurchaseModal({
  isOpen,
  onClose,
}: CreditPurchaseModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>Purchase AI Analysis Credits</SheetTitle>
          <SheetDescription>
            You need credits to perform AI analysis. Each analysis costs 1
            credit ($0.30).
          </SheetDescription>
        </SheetHeader>
        <div className='mt-6'>
          <CreditPurchase onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
