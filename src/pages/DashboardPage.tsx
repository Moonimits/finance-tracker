import CardGroup from "@/components/dashboard/CardGroup"
import ChartGroup from "@/components/dashboard/ChartGroup"
import useDateRange from "@/hooks/useDateRange"
import { useGetDashboardQuery } from "@/store/api/supabaseApi"

const DashboardPage = () => {
  const { range } = useDateRange()

  const { data, isLoading } = useGetDashboardQuery(range)

  const card_data = data?.card_data!
  const chart_data = data?.chart_data!

  return (
    <section className="flex flex-col gap-4 p-4">
      <CardGroup {...card_data} loading={isLoading} />
      <ChartGroup data={chart_data} />
    </section>
  )
}

export default DashboardPage
