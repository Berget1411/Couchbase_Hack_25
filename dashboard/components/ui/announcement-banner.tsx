"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBanner() {
  return (
    <div className='border-b border-border/40 bg-background'>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 px-3 py-3 sm:px-6 sm:py-2.5'>
        <p className='text-xs sm:text-sm leading-5 sm:leading-6 text-foreground text-center sm:text-left'>
          <strong className='font-semibold'>
            Announcing Our $5M seed round
          </strong>
        </p>
        <div className='hidden sm:block h-4 w-px bg-border/40' />
        <Link
          href='#'
          className='flex items-center text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground transition-colors text-primary'
        >
          Read more <ArrowRight className='ml-1 h-3 w-3' />
        </Link>
      </div>
    </div>
  );
}
