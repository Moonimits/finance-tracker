import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types"

export type Expense = Tables<"expenses">
export type InsertExpense = TablesInsert<"expenses">
export type UpdateExpense = TablesUpdate<"expenses">

export type ExpenseFilters = {
  search?: string
  expense_type?: string[]
  page: number
  page_size: number
  date_from?: string
  date_to?: string
}

export type ExpenseTypesValues = {
  label: string
  color: string
}

export type ExpenseType = Tables<"user_profiles">["expense_types"]
export type ExpenseTypeMeta = { label: string; color: string }
export type ExpenseTypeMap = Record<string, ExpenseTypeMeta>
