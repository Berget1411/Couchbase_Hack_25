"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuerySelector } from "@/components/ui/query-selector";
import { useSendAiRequest } from "@/hooks/api/backend/use-send-ai-request";
import { useTableContext } from "@/components/provider/table-provider";
import { UserQuery, PREDEFINED_QUERIES, RequestData } from "@/types/request";
import { IconLoader2 } from "@tabler/icons-react";
import { Github, ChevronDown, GitPullRequest, Copy, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGitHubRepositories,
  useCreateGitHubRepo,
} from "@/hooks/api/use-github-repos";
import { useUpdateAppSession } from "@/hooks/api/dashboard/use-app-session";
import { GitHubRepo } from "@/lib/api/github-service";

// Type for AI analysis response
interface AnalysisResponse {
  question_rephrase?: string;
  proposed_fix?: string;
  error?: string;
}

interface AiAnalysisProps {
  repoUrl?: string;
  appSessionId: string;
}

// Helper function to format the AI analysis result for better UX
const formatAnalysisResult = (
  data: AnalysisResponse,
  selectedRows: RequestData[]
) => {
  // Extract request summary
  const requestSummary = selectedRows
    .map((req, index) => {
      const flagText =
        req.flag === 0
          ? "✅ Good"
          : req.flag === 1
          ? "⚠️ Flagged"
          : "🚫 Blocked";
      return `${index + 1}. ${req.method} ${req.requestData} (${flagText})`;
    })
    .join("\n");

  // Format the response
  return `📋 ANALYSIS SUMMARY
${data.question_rephrase || "No analysis available"}

🔍 REQUESTS ANALYZED (${selectedRows.length} total):
${requestSummary}

💡 FINDINGS & RECOMMENDATIONS:
${data.proposed_fix || "No specific recommendations available"}

${data.error ? `❌ ERROR: ${data.error}` : ""}`.trim();
};

export function AiAnalysis({ repoUrl, appSessionId }: AiAnalysisProps) {
  const { selectedRows } = useTableContext();
  const [query, setQuery] = useState<UserQuery>(
    PREDEFINED_QUERIES.EXPLAIN_REQUESTS
  );
  const [result, setResult] = useState<string>("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [customRepoUrl, setCustomRepoUrl] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const { mutate: sendAiRequest, isPending } = useSendAiRequest();
  const { data: githubRepos = [], isLoading, error } = useGitHubRepositories();
  const createGitHubRepo = useCreateGitHubRepo();
  const updateAppSession = useUpdateAppSession();

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

  // Set default value when GitHub repos are loaded
  useEffect(() => {
    if (!repoUrl) {
      setSelectedRepoId("none");
    }
  }, [githubRepos, repoUrl]);

  const handleRepoSelect = async (repoId: string) => {
    setSelectedRepoId(repoId);

    if (repoId === "custom") {
      return;
    }

    setIsConnecting(true);

    if (!repoId || repoId === "none") {
      setIsConnecting(false);
      return;
    }

    try {
      // Find the selected GitHub repo
      const selectedRepo = githubRepos.find(
        (repo) => repo.id.toString() === repoId
      );
      if (!selectedRepo) {
        console.error("Selected repository not found");
        setIsConnecting(false);
        return;
      }

      console.log("Creating/connecting repository:", selectedRepo.full_name);

      // Create/connect the repo first
      const appGithubRepo = await createGitHubRepo.mutateAsync({
        name: selectedRepo.full_name,
        url: selectedRepo.html_url,
      });

      console.log("Repository created in database:", appGithubRepo);

      // Then connect it to the app session
      await updateAppSession.mutateAsync({
        appSessionId,
        githubRepoId: appGithubRepo.id,
      });

      console.log("Repository connected to app session successfully");
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to connect repository:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCustomRepoSubmit = async () => {
    if (!customRepoUrl.trim()) return;
    setIsConnecting(true);

    try {
      // Extract repo name from URL (e.g., "owner/repo" from GitHub URL)
      const match = customRepoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
      if (!match) {
        console.error("Invalid GitHub URL format");
        alert("Please enter a valid GitHub repository URL");
        setIsConnecting(false);
        return;
      }
      const repoName = match[1];

      console.log("Creating custom repository:", repoName);

      const newRepo = await createGitHubRepo.mutateAsync({
        name: repoName,
        url: customRepoUrl,
      });

      console.log("Custom repository created in database:", newRepo);

      await updateAppSession.mutateAsync({
        appSessionId,
        githubRepoId: newRepo.id,
      });

      console.log("Custom repository connected to app session successfully");
      setCustomRepoUrl("");
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to create/connect custom repository:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAnalyze = () => {
    if (!repoUrl) {
      alert("Please connect a repository first to analyze requests.");
      return;
    }

    if (selectedRows.length === 0) {
      alert("Please select at least one row to analyze.");
      return;
    }

    sendAiRequest(
      {
        repo_url: repoUrl,
        user_query: query,
        input_requests: selectedRows,
      },
      {
        onSuccess: (data) => {
          // Format the response for better user experience
          const formattedResult = formatAnalysisResult(
            data as AnalysisResponse,
            selectedRows
          );
          setResult(formattedResult);
        },
        onError: (error) => {
          console.error("AI analysis failed:", error);
          setResult("Analysis failed. Please try again.");
        },
      }
    );
  };

  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <div className='relative overflow-hidden rounded-lg border bg-background'>
      {/* Dark overlay when no repo is connected */}
      {!repoUrl && (
        <div className='absolute inset-0 bg-black/50 z-10 flex items-center justify-center'>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size='lg' className='shadow-lg'>
                <Github className='mr-2 h-5 w-5' />
                Connect GitHub Repository
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Connect GitHub Repository</SheetTitle>
                <SheetDescription>
                  Select a repository from your GitHub account or add a custom
                  public repository URL to enable AI analysis.
                </SheetDescription>
              </SheetHeader>

              <div className='flex-1 space-y-6 px-4 pb-4'>
                {/* GitHub Repositories */}
                <div className='space-y-3'>
                  <Label>Your GitHub Repositories</Label>
                  {isLoading ? (
                    <div className='text-sm text-muted-foreground'>
                      Loading repositories...
                    </div>
                  ) : error ? (
                    <div className='text-sm text-red-600'>
                      Failed to load repositories. Make sure your GitHub account
                      is connected.
                    </div>
                  ) : (
                    <Select
                      onValueChange={handleRepoSelect}
                      value={selectedRepoId}
                      disabled={isConnecting}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isConnecting
                              ? "Connecting..."
                              : "Select a repository"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>No repository</SelectItem>
                        {githubRepos.map((repo: GitHubRepo) => (
                          <SelectItem
                            key={repo.id.toString()}
                            value={repo.id.toString()}
                          >
                            <div className='flex items-center justify-between w-full'>
                              <span>{repo.full_name}</span>
                              {repo.description && (
                                <span className='text-xs text-muted-foreground ml-2 truncate'>
                                  {repo.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Custom Repository URL */}
                <div className='space-y-3'>
                  <Label htmlFor='custom-repo'>
                    Or enter a public repository URL
                  </Label>
                  <div className='flex gap-2'>
                    <Input
                      id='custom-repo'
                      placeholder='https://github.com/owner/repo'
                      value={customRepoUrl}
                      onChange={(e) => setCustomRepoUrl(e.target.value)}
                    />
                    <Button
                      onClick={handleCustomRepoSubmit}
                      disabled={
                        !customRepoUrl.trim() ||
                        isConnecting ||
                        createGitHubRepo.isPending
                      }
                    >
                      {isConnecting || createGitHubRepo.isPending
                        ? "Connecting..."
                        : "Connect"}
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Main AI Analysis Content (darkened when no repo) */}
      <div className={!repoUrl ? "opacity-30 pointer-events-none" : ""}>
        <div className='flex items-center justify-between px-4 py-3 lg:px-6'>
          <div className='flex items-center gap-2'>
            <h3 className='text-sm font-medium'>AI Analysis</h3>
            <Badge variant='secondary' className='text-xs'>
              {selectedRows.length} {selectedRows.length === 1 ? "row" : "rows"}{" "}
              selected
            </Badge>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
            className='h-8 w-8 p-0 hover:bg-muted'
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>
        </div>

        <div
          className={`border-t px-4 lg:px-6 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-screen py-4" : "max-h-0 py-0"
          }`}
        >
          <div className='flex flex-col gap-4 lg:flex-row lg:items-end'>
            <div className='flex-1'>
              <QuerySelector
                value={query}
                onValueChange={setQuery}
                placeholder='Select analysis type...'
                className='max-w-md'
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isPending || !repoUrl || selectedRows.length === 0}
              size='sm'
              className='w-fit'
            >
              {isPending ? (
                <>
                  <IconLoader2 className='mr-2 h-3 w-3 animate-spin' />
                  Analyzing...
                </>
              ) : (
                <>Analyze</>
              )}
            </Button>
          </div>

          {result && (
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
                        Based on the analysis, would you like to create a pull
                        request in the repository to implement the suggested
                        fixes?
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
          )}
        </div>
      </div>
    </div>
  );
}
