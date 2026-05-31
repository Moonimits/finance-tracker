import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types"

export type Constant = Tables<"constants">
export type InsertConstant = TablesInsert<"constants">
export type UpdateConstant = TablesUpdate<"constants">

export type ConstantFilters = {
  search?: string
  constant_type?: string[]
  page: number
  page_size: number
  date_from?: string
  date_to?: string
}

export type ConstantTypeMeta = { label: string; color: string }
export type ConstantTypeMap = Record<string, ConstantTypeMeta>
