import { clsx, type ClassValue } from "clsx"
import {
  differenceInCalendarDays,
  eachMonthOfInterval,
  subDays,
} from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  })

  return formatter.format(amount)
}

export function getMonthsInRange(dateRange: {
  date_from: string
  date_to: string
}) {
  const months = eachMonthOfInterval({
    start: new Date(dateRange.date_from),
    end: new Date(dateRange.date_to),
  })

  return months
}

export function getPreviousPeriod(from: string, to: string) {
  const date_from = new Date(from)
  const date_to = new Date(to)

  const days = differenceInCalendarDays(date_to, date_from) + 1
  return {
    prev_from: subDays(date_from, days),
    prev_to: subDays(date_from, 1),
  }
}

export function computePercentage(prev: number, now: number) {
  if (prev === 0 && now === 0) {
    return { type: "empty", value: null, formatted: "No data" }
  }

  if (prev === 0) {
    return { type: "new", value: null, formatted: "New" }
  }

  const difference = now - prev
  const percentage = (difference / prev) * 100

  return {
    type: "change",
    value: parseFloat(percentage.toFixed(2)),
    formatted: `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`,
  }
}
