import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { computePercentage, formatCurrency } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"

type CardGroupProps = {
  total_expenses: number
  total_savings: number
  total_budgets: number
  total_previous_expense: number
  loading: boolean
}

const CardGroupSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-4 *:bg-linear-to-t *:from-background/50 *:to-background">
      <Skeleton className="h-24 w-full rounded-2xl border" />
      <Skeleton className="h-24 w-full rounded-2xl border" />
      <Skeleton className="h-24 w-full rounded-2xl border" />
    </div>
  )
}

const CardGroup = (cardData: CardGroupProps) => {
  if (cardData.loading) return <CardGroupSkeleton />
  const {
    total_budgets,
    total_expenses,
    total_savings,
    total_previous_expense,
  } = cardData

  const { value, type, formatted } = computePercentage(
    total_previous_expense,
    total_expenses
  )

  const badgeColor = value
    ? value >= 0
      ? "bg-red-600/20 text-red-300"
      : "bg-green-600/20 text-green-300"
    : "bg-yellow-600/20 text-yellow-300"

  return (
    <div className="grid grid-cols-1 gap-4 *:bg-linear-to-t *:from-background/50 *:to-background md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
          <CardDescription className="flex items-center text-3xl font-semibold tabular-nums">
            {formatCurrency(total_expenses)}
          </CardDescription>
          {type !== "empty" && (
            <CardAction>
              <Badge className={badgeColor}>
                {type !== "new" ? (
                  value && value >= 0 ? (
                    <TrendingUp />
                  ) : (
                    <TrendingDown />
                  )
                ) : (
                  ""
                )}
                {formatted}
              </Badge>
            </CardAction>
          )}
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Savings</CardTitle>
          <CardDescription className="flex items-center text-3xl font-semibold tabular-nums">
            {formatCurrency(total_savings)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Budget</CardTitle>
          <CardDescription className="flex items-center text-3xl font-semibold tabular-nums">
            {formatCurrency(total_budgets)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Remaining Funds</CardTitle>
          <CardDescription className="flex items-center text-3xl font-semibold tabular-nums">
            {formatCurrency(total_budgets - total_expenses)}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default CardGroup
