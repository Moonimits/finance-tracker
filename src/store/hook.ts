import type { AppDispatch, Rootstate } from "@/store"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<Rootstate> = useSelector
