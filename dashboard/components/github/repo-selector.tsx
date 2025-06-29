"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useGitHubRepositories,
  useCreateGitHubRepo,
} from "@/hooks/api/use-github-repos";
import { useUpdateAppSession } from "@/hooks/api/dashboard/use-app-session";
import { GitHubRepo } from "@/lib/api/github-service";
import { Github, ExternalLink } from "lucide-react";

interface RepoSelectorProps {
  appSessionId: string;
  currentRepo?: {
    id: string;
    name: string;
    url: string;
  } | null;
}

export function RepoSelector({ appSessionId, currentRepo }: RepoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customRepoUrl, setCustomRepoUrl] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: githubRepos = [], isLoading, error } = useGitHubRepositories();
  const createGitHubRepo = useCreateGitHubRepo();
  const updateAppSession = useUpdateAppSession();

  // Set default value when GitHub repos are loaded and currentRepo exists
  useEffect(() => {
    if (githubRepos.length > 0 && currentRepo) {
      // Try to find the GitHub repo that matches the current connected repo by URL
      const matchingGithubRepo = githubRepos.find(
        (repo) => repo.html_url === currentRepo.url
      );

      if (matchingGithubRepo) {
        setSelectedRepoId(matchingGithubRepo.id.toString());
      } else if (currentRepo) {
        // If no matching GitHub repo found, but there's a current repo, it might be a custom repo
        setSelectedRepoId("custom");
      }
    } else if (!currentRepo) {
      // No current repo connected
      setSelectedRepoId("none");
    }
  }, [githubRepos, currentRepo]);

  const handleRepoSelect = async (repoId: string) => {
    setSelectedRepoId(repoId);

    // If selecting the current custom repo, no action needed
    if (repoId === "custom") {
      return;
    }

    setIsConnecting(true);

    if (!repoId || repoId === "none") {
      // Disconnect repository
      try {
        console.log("Disconnecting repository for app session:", appSessionId);

        const result = await updateAppSession.mutateAsync({
          appSessionId,
          githubRepoId: undefined,
        });

        console.log("Repository disconnected successfully:", result);
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to disconnect repository:", error);

        let errorMessage = "Failed to disconnect repository. ";
        if (error instanceof Error) {
          if (error.message.includes("Unauthorized")) {
            errorMessage += "You are not authorized to perform this action.";
          } else if (error.message.includes("404")) {
            errorMessage += "App session not found.";
          } else if (error.message.includes("500")) {
            errorMessage += "Server error occurred. Please try again later.";
          } else {
            errorMessage += error.message;
          }
        } else {
          errorMessage += "Please try again.";
        }

        alert(errorMessage);
      } finally {
        setIsConnecting(false);
      }
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
      setIsOpen(false);
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
        console.error("Invalid GitHub URL format:", customRepoUrl);
        alert(
          "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)"
        );
        setIsConnecting(false);
        return;
      }
      const repoName = match[1];

      console.log("Creating custom repository:", {
        repoName,
        url: customRepoUrl,
      });

      const newRepo = await createGitHubRepo.mutateAsync({
        name: repoName,
        url: customRepoUrl,
      });

      console.log("Custom repository created in database:", newRepo);

      const updateResult = await updateAppSession.mutateAsync({
        appSessionId,
        githubRepoId: newRepo.id,
      });

      console.log(
        "Custom repository connected to app session successfully:",
        updateResult
      );
      setCustomRepoUrl("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create/connect custom repository:", error);

      // More specific error handling
      let errorMessage = "Failed to add repository. ";
      if (error instanceof Error) {
        if (error.message.includes("Unauthorized")) {
          errorMessage += "You are not authorized to perform this action.";
        } else if (error.message.includes("400")) {
          errorMessage += "Invalid repository information provided.";
        } else if (error.message.includes("500")) {
          errorMessage += "Server error occurred. Please try again later.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Please check the URL and try again.";
      }

      alert(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      {currentRepo ? (
        <div className='flex items-center gap-2 text-sm'>
          <Github className='h-4 w-4' />
          <span className='truncate max-w-[200px]'>{currentRepo.name}</span>
          <Button variant='ghost' size='sm' asChild className='h-6 w-6 p-0'>
            <a href={currentRepo.url} target='_blank' rel='noopener noreferrer'>
              <ExternalLink className='h-3 w-3' />
            </a>
          </Button>
        </div>
      ) : null}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant='outline' size='sm'>
            <Github className='h-4 w-4 mr-2' />
            {currentRepo ? "Change Repo" : "Connect Repo"}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Connect GitHub Repository</SheetTitle>
            <SheetDescription>
              Select a repository from your GitHub account or add a custom
              public repository URL.
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
                  Failed to load repositories. Make sure your GitHub account is
                  connected.
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
                          : currentRepo
                          ? `Connected: ${currentRepo.name}`
                          : "Select a repository"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>No repository</SelectItem>
                    {currentRepo &&
                      selectedRepoId === "custom" &&
                      !githubRepos.find(
                        (repo) => repo.html_url === currentRepo.url
                      ) && (
                        <SelectItem value='custom'>
                          {currentRepo.name} (Custom Repository)
                        </SelectItem>
                      )}
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
  );
}
