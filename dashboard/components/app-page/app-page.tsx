import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { DataTable } from "@/components/sidebar/data-table";
import data from "@/components/dashboard/data.json";

export function AppDashboard({ id }: { id: string }) {
  console.log("id", id);
  return (
    <>
      <div className='px-4 lg:px-6 mb-4'>
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
