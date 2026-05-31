export type BarChartData = {
  month: string
  expenses: number
  savings: number
  budgets: number
}

export type PieChartData = {
  expense: string
  amount: number
  fill: string
}

export type ChartData = {
  expenses_data: {
    amount: number | null
    expense_type: string | null
    date: string | null
  }[]
  savings_data: {
    amount: number | null
    savings_for: string | null
    date: string | null
  }[]
  budgets_data: { amount: number | null; date: string | null }[]
  constants_data: {
    amount: number | null
    constant_type: string | null
    date: string | null
  }[]
  total_previous_expense: number
}
