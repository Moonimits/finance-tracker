import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartData, PieChartData } from "@/types/chartTypes"
import { useGetExpenseTypeQuery } from "@/store/api/supabaseApi"
import { useMemo } from "react"
import {
  computePercentage,
  formatCurrency,
  getPreviousPeriod,
} from "@/lib/utils"
import useDateRange from "@/hooks/useDateRange"
import { format } from "date-fns"

type DashboardPieChartProps = {
  chartData: ChartData["expenses_data"]
  previousTotal: number
}

const DashboardPieChart = ({
  chartData: expense_data,
  previousTotal,
}: DashboardPieChartProps) => {
  const { range } = useDateRange()
  const { data } = useGetExpenseTypeQuery()

  const expense_type = data?.expense_types ?? {}
  const dateString = `${format(range.date_from, "MMM do")} - ${format(range.date_to, "MMM do")}`

  let pieChartMap = {} as Record<string, PieChartData>

  const getMap = (expense: string) => {
    if (!pieChartMap[expense]) {
      pieChartMap[expense] = {
        expense,
        amount: 0,
        fill: `var(--color-${expense})`,
      }
    }

    return pieChartMap[expense]
  }

  expense_data.forEach((expense) => {
    const map = getMap(expense.expense_type!)
    map.amount += expense.amount!
  })

  const pieData = Object.values(pieChartMap).map((item) => item)

  const chartConfig = Object.entries(expense_type).reduce(
    (acc, [key, item], index) => {
      return {
        ...acc,
        [key]: { label: item.label, color: `var(--chart-${index + 1})` },
      }
    },
    {}
  ) satisfies ChartConfig

  const totalExpenses = useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [pieData])

  const percentage = useMemo(() => {
    return computePercentage(previousTotal, totalExpenses)
  }, [pieData, previousTotal])

  const createPieLabel = () => {
    let label
    const previousDate = getPreviousPeriod(range.date_from, range.date_to)
    const prevDateString = `${format(new Date(previousDate.prev_from), "MMM do")} - ${format(new Date(previousDate.prev_to), "MMM do")}`
    if (percentage.value) {
      label =
        percentage.value >= 0
          ? `Expenses went up by ${percentage.formatted} compared from ${prevDateString}`
          : `Expenses went down by ${percentage.formatted} compared from ${prevDateString}`
    } else {
      label = `You dont have any expenses on ${prevDateString} to compare`
    }

    return label
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center border-b pb-0">
        <CardTitle>Expenses Summary</CardTitle>
        <CardDescription>
          A brief summary about your expenses composistion
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="amount"
              nameKey="expense"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {formatCurrency(totalExpenses).replace(".00", "")}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Expenses
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {createPieLabel()}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses throughout{" "}
          <span className="font-bold">{dateString}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default DashboardPieChart
