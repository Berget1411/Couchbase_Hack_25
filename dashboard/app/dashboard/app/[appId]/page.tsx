import { AppDashboard } from "@/components/app-page";

export default async function AppDashboardPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  return <AppDashboard id={appId} />;
}
