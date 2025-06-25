"use client";

import { useState } from "react";
import {
  useGitHubRepos,
  useConnectRepo,
  useDisconnectRepo,
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
} from "react-icons/fa";

export function RepoManager() {
  const { data: repos, isLoading, error, refetch } = useGitHubRepos();
  const connectMutation = useConnectRepo();
  const disconnectMutation = useDisconnectRepo();
  const [searchTerm, setSearchTerm] = useState("");
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  const handleConnect = (repoFullName: string) => {
    connectMutation.mutate({ repoFullName });
  };

  const handleDisconnect = (repoFullName: string) => {
    disconnectMutation.mutate({ repoFullName });
  };

  const filteredRepos =
    repos?.filter((repo) => {
      const matchesSearch =
        repo.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = showConnectedOnly ? repo.isConnected : true;
      return matchesSearch && matchesFilter;
    }) || [];

  const connectedCount = repos?.filter((repo) => repo.isConnected).length || 0;
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
              {connectedCount} of {totalCount} repositories connected
            </p>
          </div>
        </div>

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

        <div className='flex gap-2'>
          <Button
            variant={showConnectedOnly ? "default" : "outline"}
            size='sm'
            onClick={() => setShowConnectedOnly(!showConnectedOnly)}
          >
            {showConnectedOnly ? "Show All" : "Connected Only"}
          </Button>
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
              {searchTerm || showConnectedOnly
                ? "No repositories found"
                : "No repositories available"}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {searchTerm
                ? "Try adjusting your search terms"
                : showConnectedOnly
                ? "Connect some repositories to see them here"
                : "Make sure you have repositories in your GitHub account"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {filteredRepos.map((repo) => (
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
                    <Badge variant={repo.isConnected ? "default" : "outline"}>
                      {repo.isConnected ? "Connected" : "Available"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='pt-0'>
                <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
                  <span className='flex items-center gap-1'>
                    <FaStar className='w-3 h-3' />
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                  <span className='flex items-center gap-1'>
                    <FaCodeBranch className='w-3 h-3' />
                    {repo.forks_count.toLocaleString()}
                  </span>
                  {repo.open_issues_count > 0 && (
                    <span className='flex items-center gap-1'>
                      <FaExclamationCircle className='w-3 h-3' />
                      {repo.open_issues_count.toLocaleString()}
                    </span>
                  )}
                </div>

                <Button
                  size='sm'
                  variant={repo.isConnected ? "destructive" : "default"}
                  onClick={() =>
                    repo.isConnected
                      ? handleDisconnect(repo.full_name)
                      : handleConnect(repo.full_name)
                  }
                  disabled={
                    connectMutation.isPending || disconnectMutation.isPending
                  }
                >
                  {connectMutation.isPending || disconnectMutation.isPending
                    ? "Processing..."
                    : repo.isConnected
                    ? "Disconnect"
                    : "Connect"}
                </Button>
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
