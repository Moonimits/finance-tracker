import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import useDateRange from "@/hooks/useDateRange"
import { getMonthsInRange } from "@/lib/utils"
import type { BarChartData, ChartData } from "@/types/chartTypes"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type DashboardBarChartProps = {
  chartData: ChartData
}

const DashboardBarChart = ({ chartData }: DashboardBarChartProps) => {
  const { range } = useDateRange()

  const { budgets_data, expenses_data, savings_data } = chartData
  const months = getMonthsInRange(range)

  let barChartMap = {} as Record<string, BarChartData>

  const getMap = (month: string) => {
    if (!barChartMap[month]) {
      barChartMap[month] = { month, expenses: 0, savings: 0, budgets: 0 }
    }

    return barChartMap[month]
  }

  months.forEach((month) => {
    const monthString = format(month, "MMMM")
    getMap(monthString)
  })

  expenses_data.forEach((expense) => {
    const map = getMap(format(new Date(expense.date!), "MMMM"))
    map.expenses += expense.amount!
  })

  savings_data.forEach((savings) => {
    const map = getMap(format(new Date(savings.date!), "MMMM"))
    map.savings += savings.amount!
  })

  budgets_data.forEach((budget) => {
    const map = getMap(format(new Date(budget.date!), "MMMM"))
    map.budgets += budget.amount!
  })

  const barData = Object.values(barChartMap).sort(
    (a, b) => Date.parse(`1 ${a.month} 2000`) - Date.parse(`1 ${b.month} 2000`)
  )

  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "var(--chart-1)",
    },
    savings: {
      label: "Savings",
      color: "var(--chart-2)",
    },
    budgets: {
      label: "Budgets",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col">
          <CardTitle>Funds Summary</CardTitle>
          <CardDescription>
            Your savings, expenses and budgets through out the time
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-50 w-full p-6">
          <BarChart accessibilityLayer data={barData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default DashboardBarChart
