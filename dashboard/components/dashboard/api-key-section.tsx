"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function ApiKeySection() {
  const { data: session } = authClient.useSession();
  const [isCopied, setIsCopied] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Your API key for accessing the analysis service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
          <code className='text-sm font-mono'>{session?.user.apiKey}</code>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              navigator.clipboard.writeText(session?.user.apiKey || "");
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 2000);
            }}
          >
            {isCopied ? (
              <Check className='h-4 w-4 mr-2 text-green-500' />
            ) : (
              <Copy className='h-4 w-4 mr-2' />
            )}
            {isCopied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
