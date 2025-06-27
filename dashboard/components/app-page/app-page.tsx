"use client";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { DataTable } from "@/components/sidebar/data-table";
import data from "@/components/dashboard/data.json";
import { useAppSessionRequests } from "@/hooks/api/backend/use-app-session-requests";
import { useGetAppSession } from "@/hooks/api/dashboard/use-app-session";
import { useParams } from "next/navigation";
export function AppDashboard() {
  const { appId } = useParams();
  const { data: appSession } = useGetAppSession(appId as string);
  const { data: appSessionRequests } = useAppSessionRequests(
    appId as string,
    10
  );

  console.log(appSessionRequests);

  return (
    <>
      <div className='px-4 lg:px-6 mb-4'>
        {Array.isArray(appSessionRequests) && (
          <div>
            {appSessionRequests.map(
              (request: { id: string; name: string; description: string }) => (
                <div key={request.id}>
                  <h2 className='text-lg font-bold'>{request.name}</h2>
                  <p className='text-sm text-gray-500'>{request.description}</p>
                </div>
              )
            )}
          </div>
        )}
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
