"use client";

import {
  CreditOverview,
  CreditUsage,
  ApiKeySection,
} from "@/components/dashboard";

export function Dashboard() {
  return (
    <div className='flex flex-col gap-6 px-4 lg:px-6'>
      {/* Welcome Section */}
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold'>Welcome back!</h1>
        <p className='text-muted-foreground'>
          Manage your AI analysis credits and track your usage.
        </p>
      </div>
      <CreditOverview />
      <CreditUsage />
      <ApiKeySection />
    </div>
  );
}
