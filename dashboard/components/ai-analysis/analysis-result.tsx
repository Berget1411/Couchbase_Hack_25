import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, GitPullRequest } from "lucide-react";

interface AnalysisResultProps {
  result: string;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Copy to clipboard function
  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!result) return null;

  return (
    <div className='mt-4 space-y-4'>
      <div className='overflow-hidden rounded-md border bg-muted/30'>
        <div className='border-b bg-muted px-3 py-2 flex items-center justify-between'>
          <span className='text-xs font-medium text-muted-foreground'>
            Analysis Result
          </span>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleCopyResult}
            className='h-6 w-6 p-0 hover:bg-muted-foreground/10'
          >
            {isCopied ? (
              <Check className='h-3 w-3 text-green-600' />
            ) : (
              <Copy className='h-3 w-3' />
            )}
          </Button>
        </div>
        <div className='p-3'>
          <pre className='text-xs text-muted-foreground whitespace-pre-wrap overflow-auto max-h-60'>
            {result}
          </pre>
        </div>
      </div>

      {/* PR Creation Section */}
      <div className='overflow-hidden rounded-md border bg-background'>
        <div className='border-b bg-muted px-3 py-2'>
          <span className='text-xs font-medium text-muted-foreground'>
            Next Steps
          </span>
        </div>
        <div className='p-4'>
          <div className='flex items-start gap-3'>
            <div className='rounded-full bg-blue-50 p-2'>
              <GitPullRequest className='h-4 w-4 text-blue-600' />
            </div>
            <div className='flex-1 space-y-2'>
              <h4 className='text-sm font-medium text-foreground'>
                Create Pull Request
              </h4>
              <p className='text-xs text-muted-foreground'>
                Based on the analysis, would you like to create a pull request
                in the repository to implement the suggested fixes?
              </p>
              <div className='flex gap-2 pt-1'>
                <Button
                  size='sm'
                  onClick={() => {
                    // TODO: Implement PR creation functionality
                    console.log("Create PR clicked");
                  }}
                  className='h-8'
                >
                  <GitPullRequest className='mr-1.5 h-3 w-3' />
                  Create PR
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
