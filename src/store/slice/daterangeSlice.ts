import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { endOfMonth, format, startOfMonth } from "date-fns"

type DateRangeState = {
  from: string | undefined
  to: string | undefined
}

const initialState: DateRangeState = {
  from: format(startOfMonth(new Date()), "y-MM-dd"),
  to: format(endOfMonth(new Date()), "y-MM-dd"),
}

const daterangeSlice = createSlice({
  name: "daterange",
  initialState,
  reducers: {
    setDateRange: (_, action: PayloadAction<DateRangeState>) => {
      return { ...action.payload }
    },
  },
})

export const { setDateRange } = daterangeSlice.actions
export default daterangeSlice.reducer
