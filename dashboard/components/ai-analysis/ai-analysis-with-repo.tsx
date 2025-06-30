"use client";

import React from "react";
import { RepoSelector } from "@/components/github/repo-selector";
import { AiAnalysis } from "./ai-analysis";

interface AiAnalysisWithRepoProps {
  appSessionId: string;
  repoUrl?: string;
  currentRepo?: {
    id: string;
    name: string;
    url: string;
  } | null;
}

export function AiAnalysisWithRepo({
  appSessionId,
  repoUrl,
  currentRepo,
}: AiAnalysisWithRepoProps) {
  return (
    <div className='space-y-4'>
      {/* Repository Selector */}
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <h2 className='text-lg font-semibold'>Repository Connection</h2>
          <p className='text-sm text-muted-foreground'>
            Connect a repository to enable AI analysis of requests
          </p>
        </div>
        <RepoSelector appSessionId={appSessionId} currentRepo={currentRepo} />
      </div>

      {/* AI Analysis Component */}
      <AiAnalysis repoUrl={repoUrl} />
    </div>
  );
}
