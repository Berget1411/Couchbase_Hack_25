"use client";

import { authClient } from "@/lib/auth-client";

export function Dashboard() {
  const { data: session } = authClient.useSession();

  return (
    <div className='flex flex-col gap-4 px-4 lg:px-6'>
      <div className='text-sm text-muted-foreground'>
        Api Key: {session?.user.apiKey}
      </div>
    </div>
  );
}
