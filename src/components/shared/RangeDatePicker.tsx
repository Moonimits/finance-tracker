import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { setDateRange } from "@/store/slice/daterangeSlice"
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
} from "date-fns"
import { CalendarRange } from "lucide-react"
import { useMemo } from "react"
import type { DateRange } from "react-day-picker"

const RangeDatePicker = () => {
  const dateString = useAppSelector((state) => state.daterange)
  const dispatch = useAppDispatch()

  const range = useMemo(() => {
    return {
      from: dateString.from ? new Date(dateString.from) : undefined,
      to: dateString.to ? new Date(dateString.to) : undefined,
    }
  }, [dateString])

  const handleSelectRange = (range: DateRange | undefined) => {
    dispatch(
      setDateRange({
        from: format(range?.from || new Date(), "y-MM-dd"),
        to: format(range?.to || new Date(), "y-MM-dd"),
      })
    )
  }

  const rangeMap = {
    week: {
      label: "This Week",
      range: {
        from: format(startOfWeek(new Date()), "y-MM-dd"),
        to: format(endOfWeek(new Date()), "y-MM-dd"),
      },
    },
    month: {
      label: "This Month",
      range: {
        from: format(startOfMonth(new Date()), "y-MM-dd"),
        to: format(endOfMonth(new Date()), "y-MM-dd"),
      },
    },
    past3: {
      label: "Past 3 Month",
      range: {
        from: format(startOfMonth(subMonths(new Date(), 2)), "y-MM-dd"),
        to: format(endOfMonth(new Date()), "y-MM-dd"),
      },
    },
    past6: {
      label: "Past 6 Month",
      range: {
        from: format(startOfMonth(subMonths(new Date(), 5)), "y-MM-dd"),
        to: format(endOfMonth(new Date()), "y-MM-dd"),
      },
    },
    year: {
      label: "This Year",
      range: {
        from: format(startOfYear(new Date()), "y-MM-dd"),
        to: format(endOfYear(new Date()), "y-MM-dd"),
      },
    },
  }

  const handleChangeRange = (rangeKey: keyof typeof rangeMap) => {
    return () => dispatch(setDateRange(rangeMap[rangeKey].range))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarRange />
          <span className="hidden md:block">
            {range.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y")} {" - "}
                  {format(range.to, "LLL dd, y")}
                </>
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              "Pick a Date"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-52 p-0 md:min-w-107" align="end">
        <Calendar
          mode="range"
          defaultMonth={range.from}
          selected={range}
          onSelect={handleSelectRange}
          numberOfMonths={2}
        />
        <Separator />
        <div className="flex flex-wrap gap-2 p-2">
          {Object.entries(rangeMap).map(([key, value]) => {
            const itemRange = value.range
            const isActive =
              itemRange.from === dateString.from &&
              itemRange.to === dateString.to

            return (
              <Button
                key={key}
                variant={isActive ? "default" : "outline"}
                onClick={handleChangeRange(key as keyof typeof rangeMap)}
                className="flex-1"
              >
                {value.label}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default RangeDatePicker
