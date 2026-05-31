import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types"

export type Budget = Tables<"budgets">
export type InsertBudget = TablesInsert<"budgets">
export type UpdateBudget = TablesUpdate<"budgets">

export type BudgetFilters = {
  search?: string
  page: number
  page_size: number
  date_from?: string
  date_to?: string
}
