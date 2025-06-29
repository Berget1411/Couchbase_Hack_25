"use client";

import { useState } from "react";
import {
  useGitHubRepositories,
  useCreateGitHubRepo,
} from "@/hooks/api/use-github-repos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaExclamationCircle,
  FaLock,
  FaSearch,
  FaSync,
  FaPlus,
} from "react-icons/fa";
import { GitHubRepo } from "@/lib/api/github-service";

export function RepoManager() {
  const { data: repos, isLoading, error, refetch } = useGitHubRepositories();
  const createMutation = useCreateGitHubRepo();
  const [searchTerm, setSearchTerm] = useState("");
  const [customRepoUrl, setCustomRepoUrl] = useState("");
  const [showAddRepo, setShowAddRepo] = useState(false);

  const handleAddCustomRepo = async () => {
    if (!customRepoUrl.trim()) return;

    try {
      // Extract repo name from URL (e.g., "owner/repo" from GitHub URL)
      const match = customRepoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
      if (!match) {
        alert("Please enter a valid GitHub repository URL");
        return;
      }
      const repoName = match[1];

      await createMutation.mutateAsync({
        name: repoName,
        url: customRepoUrl,
      });

      setCustomRepoUrl("");
      setShowAddRepo(false);
    } catch (error) {
      console.error("Failed to add repository:", error);
      alert("Failed to add repository. Please try again.");
    }
  };

  const filteredRepos =
    repos?.filter((repo: GitHubRepo) => {
      const matchesSearch =
        repo.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }) || [];

  const totalCount = repos?.length || 0;

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-8 w-24' />
        </div>
        <Skeleton className='h-10 w-full' />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className='p-4'>
              <Skeleton className='h-4 w-1/2 mb-2' />
              <Skeleton className='h-3 w-full mb-4' />
              <div className='flex gap-2'>
                <Skeleton className='h-6 w-16' />
                <Skeleton className='h-6 w-16' />
                <Skeleton className='h-6 w-16' />
              </div>
              <Skeleton className='h-8 w-20 mt-3' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <FaExclamationCircle
            className='mx-auto mb-4 text-red-500'
            size={32}
          />
          <h3 className='text-lg font-semibold mb-2'>
            Unable to load repositories
          </h3>
          <p className='text-sm text-muted-foreground mb-4'>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button onClick={() => refetch()} variant='outline'>
            <FaSync className='mr-2 h-4 w-4' />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with stats */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <FaGithub className='text-2xl' />
          <div>
            <h2 className='text-xl font-semibold'>GitHub Repositories</h2>
            <p className='text-sm text-muted-foreground'>
              {totalCount} repositories available
            </p>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            onClick={() => setShowAddRepo(!showAddRepo)}
            variant='outline'
            size='sm'
          >
            <FaPlus className='mr-2 h-4 w-4' />
            Add Repository
          </Button>
          <Button
            onClick={() => refetch()}
            variant='outline'
            size='sm'
            disabled={isLoading}
          >
            <FaSync className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Add custom repository */}
      {showAddRepo && (
        <Card>
          <CardContent className='p-4'>
            <div className='space-y-3'>
              <h3 className='font-medium'>Add Custom Repository</h3>
              <div className='flex gap-2'>
                <Input
                  placeholder='https://github.com/owner/repo'
                  value={customRepoUrl}
                  onChange={(e) => setCustomRepoUrl(e.target.value)}
                  className='flex-1'
                />
                <Button
                  onClick={handleAddCustomRepo}
                  disabled={!customRepoUrl.trim() || createMutation.isPending}
                >
                  {createMutation.isPending ? "Adding..." : "Add"}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowAddRepo(false);
                    setCustomRepoUrl("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <FaSearch className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search repositories...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Repository list */}
      {filteredRepos.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <FaGithub
              className='mx-auto mb-4 text-muted-foreground'
              size={48}
            />
            <h3 className='text-lg font-semibold mb-2'>
              {searchTerm
                ? "No repositories found"
                : "No repositories available"}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Connect your GitHub account or add repositories to see them here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {filteredRepos.map((repo: GitHubRepo) => (
            <Card key={repo.id} className='transition-shadow hover:shadow-md'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <CardTitle className='text-base font-medium truncate'>
                        <a
                          href={repo.html_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='hover:underline flex items-center gap-2'
                        >
                          {repo.full_name}
                          {repo.private && (
                            <FaLock className='h-3 w-3 text-muted-foreground' />
                          )}
                        </a>
                      </CardTitle>
                    </div>
                    {repo.description && (
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {repo.description}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center gap-2 ml-4'>
                    <Badge variant='default'>Available</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='pt-0'>
                <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
                  <span className='flex items-center gap-1'>
                    <FaStar className='w-3 h-3' />
                    {repo.stargazers_count?.toLocaleString() || "0"}
                  </span>
                  <span className='flex items-center gap-1'>
                    <FaCodeBranch className='w-3 h-3' />
                    {repo.forks_count?.toLocaleString() || "0"}
                  </span>
                  {repo.open_issues_count && repo.open_issues_count > 0 && (
                    <span className='flex items-center gap-1'>
                      <FaExclamationCircle className='w-3 h-3' />
                      {repo.open_issues_count.toLocaleString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {totalCount > 0 && (
        <div className='text-center text-sm text-muted-foreground'>
          Showing {filteredRepos.length} of {totalCount} repositories
        </div>
      )}
    </div>
  );
}
