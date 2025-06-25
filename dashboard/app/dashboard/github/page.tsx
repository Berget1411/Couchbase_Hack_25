import { RepoManager } from "@/components/github/repo-manager";

export const metadata = {
  title: "GitHub Integration",
  description: "Connect and manage your GitHub repositories",
};

export default function GitHubPage() {
  return (
    <div className='p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>GitHub Integration</h1>
          <p className='text-muted-foreground text-lg'>
            Connect your GitHub repositories to enable advanced debugging and
            monitoring features.
          </p>
        </div>

        <RepoManager />
      </div>
    </div>
  );
}
