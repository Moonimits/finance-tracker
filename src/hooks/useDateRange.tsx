import { useAppSelector } from "@/store/hook"
import { format } from "date-fns"
import { useMemo } from "react"

const useDateRange = () => {
  const datestring = useAppSelector((state) => state.daterange)

  const range = useMemo(() => {
    return {
      date_from: datestring?.from ?? format(new Date(), "y-MM-dd"),
      date_to: datestring?.to ?? format(new Date(), "y-MM-dd"),
    }
  }, [datestring])

  return { datestring, range }
}

export default useDateRange
