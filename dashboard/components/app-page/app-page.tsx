"use client";
import React from "react";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { DataTable } from "@/components/sidebar/data-table";
import { AiAnalysis } from "@/components/ai-analysis/ai-analysis";
import { useAppSessionRequests } from "@/hooks/api/backend/use-app-session-requests";
import { useGetAppSession } from "@/hooks/api/dashboard/use-app-session";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { RequestData } from "@/types/request";

// Type definitions for the raw API response data
interface ApiRequestData {
  allowed_origins: string[];
  api_key: string;
  app_name: string;
  flag: number;
  request_data: Record<string, unknown>;
  request_method: string;
  sender_ip: string;
  session_id: string;
  timestamp: string;
}

interface AppSessionRequest {
  Requests: ApiRequestData;
  doc_id: string;
}

interface ChartDataPoint {
  date: string;
  requests: number;
  desktop: number;
  mobile: number;
}

// Helper function to transform requests into chart data
function transformRequestsToChartData(
  requests: AppSessionRequest[]
): ChartDataPoint[] {
  if (!requests || !Array.isArray(requests)) return [];

  // Group requests by date
  const requestsByDate: { [key: string]: number } = {};

  requests.forEach((request) => {
    if (request.Requests?.timestamp) {
      // Parse timestamp format "2025/06/29/16:27:17"
      const [datePart] = request.Requests.timestamp.split("/").slice(0, 3);
      const year = datePart;
      const month = request.Requests.timestamp.split("/")[1];
      const day = request.Requests.timestamp.split("/")[2];
      const dateKey = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      requestsByDate[dateKey] = (requestsByDate[dateKey] || 0) + 1;
    }
  });

  // Convert to chart format
  return Object.entries(requestsByDate)
    .map(([date, count]) => ({
      date,
      requests: count,
      desktop: Math.floor(count * 0.6), // Simulate desktop/mobile split
      mobile: Math.floor(count * 0.4),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper function to transform requests into table data
function transformRequestsToTableData(
  requests: AppSessionRequest[]
): RequestData[] {
  if (!requests || !Array.isArray(requests)) return [];

  return requests.map((request, index) => ({
    id: index + 1,
    timestamp: request.Requests?.timestamp || "N/A",
    method: request.Requests?.request_method || "N/A",
    senderIp: request.Requests?.sender_ip || "N/A",
    sessionId: request.Requests?.session_id || "N/A",
    apiKey: request.Requests?.api_key || "N/A",
    flag: request.Requests?.flag?.toString() || "0",
    requestData: JSON.stringify(request.Requests?.request_data || {}),
    docId: request.doc_id || "N/A",
  }));
}

// Loading skeleton for the chart
function ChartSkeleton() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <Skeleton className='h-6 w-32 mb-2' />
        <Skeleton className='h-4 w-48' />
        <div className='flex justify-end'>
          <Skeleton className='h-8 w-40' />
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <Skeleton className='aspect-auto h-[250px] w-full' />
      </CardContent>
    </Card>
  );
}

// Loading skeleton for the table
function TableSkeleton() {
  return (
    <div className='space-y-4 px-4 lg:px-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-32' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-8 w-32' />
        </div>
      </div>
      <div className='rounded-lg border'>
        <div className='bg-muted p-4'>
          <div className='grid grid-cols-8 gap-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-4 w-full' />
            ))}
          </div>
        </div>
        <div className='divide-y'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='p-4'>
              <div className='grid grid-cols-8 gap-4'>
                {Array.from({ length: 8 }).map((_, j) => (
                  <Skeleton key={j} className='h-4 w-full' />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-48' />
        <div className='flex items-center gap-4'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-4 w-32' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppDashboard() {
  const { appId } = useParams();
  const fetchLimit = 50; // Fetch more data than default to support pagination

  const {
    data: appSessionRequests,
    isLoading,
    error,
  } = useAppSessionRequests(appId as string, fetchLimit);

  const { data: appSession } = useGetAppSession(appId as string);

  console.log(appSessionRequests);

  const chartData = transformRequestsToChartData(
    (appSessionRequests as AppSessionRequest[]) || []
  );
  const tableData = transformRequestsToTableData(
    (appSessionRequests as AppSessionRequest[]) || []
  );

  if (error) {
    return (
      <div className='px-4 lg:px-6'>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <h2 className='text-lg font-semibold text-red-800 mb-2'>
            Error Loading Data
          </h2>
          <p className='text-sm text-red-600'>
            There was an error loading the request data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className='px-4 lg:px-6 mb-4'>
          <div className='mb-4'>
            <Skeleton className='h-6 w-32 mb-2' />
            <Skeleton className='h-4 w-48' />
          </div>
          <ChartSkeleton />
        </div>
        <TableSkeleton />
      </>
    );
  }

  return (
    <>
      <div className='px-4 lg:px-6 mb-4'>
        {Array.isArray(appSessionRequests) && (
          <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Request Summary</h2>
            <p className='text-sm text-gray-500'>
              Total requests: {appSessionRequests.length}
            </p>
          </div>
        )}
        <ChartAreaInteractive data={chartData} isLoading={isLoading} />
      </div>
      <div className='px-4 lg:px-6'>
        <AiAnalysis
          repoUrl={appSession?.githubRepo?.url}
          appSessionId={appId as string}
        />
      </div>
      <DataTable data={tableData} isLoading={isLoading} />
    </>
  );
}
