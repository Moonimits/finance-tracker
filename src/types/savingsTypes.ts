import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types"

export type Savings = Tables<"savings">
export type InsertSavings = TablesInsert<"savings">
export type UpdateSavings = TablesUpdate<"savings">

export type SavingsFilter = {
  search?: string
  savings_for?: string[]
  page: number
  page_size: number
  date_from?: string
  date_to?: string
}

export type SavingsFor = Tables<"user_profiles">["savings_for"]
export type SavingsForMeta = { label: string; color: string }
export type SavingsForMap = Record<string, SavingsForMeta>
