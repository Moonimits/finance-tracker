import DashboardBarChart from "@/components/shared/charts/DashboardBarChart"
import DashboardPieChart from "@/components/shared/charts/DashboardPieChart"
import { Skeleton } from "@/components/ui/skeleton"
import type { ChartData } from "@/types/chartTypes"

type ChartGroupProps = {
  data: ChartData
}

const ChartGroupSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="min-h-108 w-full p-6" />
      <Skeleton className="min-h-108 w-full p-6" />
    </div>
  )
}

const ChartGroup = ({ data }: ChartGroupProps) => {
  if (!data) return <ChartGroupSkeleton />

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DashboardBarChart chartData={data} />
      <DashboardPieChart
        chartData={data.expenses_data}
        previousTotal={data.total_previous_expense}
      />
    </div>
  )
}

export default ChartGroup
