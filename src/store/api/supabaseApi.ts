import { supabase } from "@/lib/supabase"
import { getPreviousPeriod } from "@/lib/utils"
import type {
  BudgetFilters,
  InsertBudget,
  UpdateBudget,
} from "@/types/budgetTypes"
import type {
  ConstantFilters,
  ConstantTypeMap,
  InsertConstant,
  UpdateConstant,
} from "@/types/constatTypes"
import type { ExpenseFilters, ExpenseTypeMap } from "@/types/expenseTypes"
import type {
  InsertSavings,
  SavingsFilter,
  SavingsForMap,
  UpdateSavings,
} from "@/types/savingsTypes"
import type { TablesInsert, TablesUpdate } from "@/types/supabase.types"
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { format } from "date-fns"

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "Expense",
    "ExpenseType",
    "Savings",
    "Budgets",
    "Constants",
    "Dashboard",
  ],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      queryFn: async (filters: { date_from: string; date_to: string }) => {
        try {
          const { date_from, date_to } = filters
          const { prev_from, prev_to } = getPreviousPeriod(date_from, date_to)

          const [
            { data: expenses_data, error: expenses_error },
            { data: savings_data, error: savings_error },
            { data: budgets_data, error: budgets_error },
            { data: constants_data, error: constants_error },
            { data: previous_data, error: previous_error },
          ] = await Promise.all([
            supabase
              .from("expenses")
              .select("amount, expense_type, date")
              .gte("date", date_from)
              .lte("date", date_to),
            supabase
              .from("savings")
              .select("amount, savings_for, date")
              .gte("date", date_from)
              .lte("date", date_to),
            supabase
              .from("budgets")
              .select("amount, date")
              .gte("date", date_from)
              .lte("date", date_to),
            supabase
              .from("constants")
              .select("amount, constant_type, date")
              .gte("date", date_from)
              .lte("date", date_to),
            supabase
              .from("expenses")
              .select("amount")
              .gte("date", format(prev_from, "y-MM-dd"))
              .lte("date", format(prev_to, "y-MM-dd")),
          ])

          if (expenses_error) throw expenses_error
          if (savings_error) throw savings_error
          if (budgets_error) throw budgets_error
          if (constants_error) throw constants_error
          if (previous_error) throw previous_error

          const sum = (data: { amount: number | null }[]) => {
            return data.reduce((acc, item) => (acc += item?.amount ?? 0), 0)
          }

          return {
            data: {
              card_data: {
                total_expenses: sum(expenses_data),
                total_savings: sum(savings_data),
                total_budgets: sum(budgets_data),
                total_previous_expense: sum(previous_data),
              },
              chart_data: {
                expenses_data,
                savings_data,
                budgets_data,
                constants_data,
                total_previous_expense: sum(previous_data),
              },
            },
          }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      providesTags: ["Dashboard"],
    }),

    getExpenseType: builder.query<{ expense_types: ExpenseTypeMap }, void>({
      queryFn: async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) return { error: "Not authenticated" }

          const { data, error } = await supabase
            .from("user_profiles")
            .select("expense_types")
            .eq("id", user.id)
            .single()

          if (error) throw error

          return {
            data: {
              expense_types: (data.expense_types ?? {}) as ExpenseTypeMap,
            },
          }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      providesTags: ["ExpenseType"],
    }),
    getSavingsFor: builder.query<{ savings_for: SavingsForMap }, void>({
      queryFn: async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) return { error: "Not authenticated" }

          const { data, error } = await supabase
            .from("user_profiles")
            .select("savings_for")
            .eq("id", user.id)
            .single()

          if (error) throw error

          return {
            data: {
              savings_for: (data.savings_for ?? {}) as SavingsForMap,
            },
          }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      providesTags: ["ExpenseType"],
    }),

    getExpense: builder.query({
      queryFn: async (filters: ExpenseFilters) => {
        try {
          const { page, page_size, search, expense_type, date_from, date_to } =
            filters

          let query = supabase
            .from("expenses")
            .select("*", { count: "exact" })
            .range((page - 1) * page_size, page * page_size - 1)
            .order("date", { ascending: false })

          if (search) {
            query = query.ilike("expense_name", `%${search}%`)
          }

          if (expense_type && expense_type.length > 0) {
            query = query.in("expense_type", expense_type)
          }

          if (date_from && date_to) {
            query = query.gte("date", date_from).lte("date", date_to)
          }

          const [
            { data, error, count },
            { data: profile, error: profileError },
          ] = await Promise.all([
            query,
            supabase.from("user_profiles").select("expense_types").single(),
          ])

          if (error) throw error
          if (profileError) throw profileError

          return {
            data: {
              expenses: data,
              expenseTypeMap: profile.expense_types as ExpenseTypeMap,
              total: count,
            },
          }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      providesTags: ["Expense"],
    }),
    addExpense: builder.mutation({
      queryFn: async (params: TablesInsert<"expenses">) => {
        try {
          const { amount, expense_name, expense_type, date } = params

          const { error } = await supabase
            .from("expenses")
            .insert({ amount, expense_name, expense_type, date })

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Expense", "Dashboard"],
    }),
    editExpense: builder.mutation({
      queryFn: async (params: TablesUpdate<"expenses">) => {
        try {
          const { id, amount, expense_name, expense_type, date } = params

          const { error } = await supabase
            .from("expenses")
            .update({
              amount,
              expense_name,
              expense_type,
              date,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id!)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Expense", "Dashboard"],
    }),
    deleteExpense: builder.mutation({
      queryFn: async (ids: number[]) => {
        try {
          const { error } = await supabase
            .from("expenses")
            .delete()
            .in("id", ids)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Expense", "Dashboard"],
    }),

    getSavings: builder.query({
      queryFn: async (filters: SavingsFilter) => {
        try {
          const { page, page_size, search, savings_for, date_from, date_to } =
            filters

          let query = supabase
            .from("savings")
            .select("*", { count: "exact" })
            .range((page - 1) * page_size, page * page_size - 1)
            .order("date", { ascending: false })

          if (search) {
            query = query.ilike("savings_for", `%${search}%`)
          }

          if (savings_for && savings_for.length > 0) {
            query = query.in("savings_for", savings_for)
          }

          if (date_from && date_to) {
            query = query.gte("date", date_from).lte("date", date_to)
          }

          const [
            { data, error, count },
            { data: profile, error: profileError },
          ] = await Promise.all([
            query,
            supabase.from("user_profiles").select("savings_for").single(),
          ])

          if (error) throw error
          if (profileError) throw profileError

          return {
            data: {
              savings: data,
              savingsForMap: (profile?.savings_for ?? {}) as SavingsForMap,
              total: count,
            },
          }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      providesTags: ["Savings"],
    }),
    addSavings: builder.mutation({
      queryFn: async (params: InsertSavings) => {
        try {
          const { amount, savings_for, date } = params

          const { error } = await supabase
            .from("savings")
            .insert({ amount, savings_for, date })

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Savings", "Dashboard"],
    }),
    updateSavings: builder.mutation({
      queryFn: async (params: UpdateSavings) => {
        try {
          const { id, amount, savings_for, date } = params

          const { error } = await supabase
            .from("savings")
            .update({
              amount,
              savings_for,
              date,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id!)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Savings", "Dashboard"],
    }),
    deleteSavings: builder.mutation({
      queryFn: async (ids: number[]) => {
        try {
          const { error } = await supabase
            .from("savings")
            .delete()
            .in("id", ids)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Savings", "Dashboard"],
    }),

    getBudget: builder.query({
      queryFn: async (filters: BudgetFilters) => {
        try {
          const { page, page_size, date_from, date_to } = filters

          let query = supabase
            .from("budgets")
            .select("*", { count: "exact" })
            .range((page - 1) * page_size, page_size * page - 1)
            .order("date", { ascending: false })

          if (date_from && date_to) {
            query.gte("date", date_from).lte("date", date_to)
          }

          const { data, error, count } = await query

          if (error) throw error

          return { data: { budgets: data, total: count } }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      providesTags: ["Budgets"],
    }),
    addBudget: builder.mutation({
      queryFn: async (params: InsertBudget) => {
        try {
          const { amount, date } = params

          const { error } = await supabase
            .from("budgets")
            .insert({ amount, date })

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Budgets", "Dashboard"],
    }),
    updateBudget: builder.mutation({
      queryFn: async (params: UpdateBudget) => {
        try {
          const { id, amount, date } = params

          const { error } = await supabase
            .from("budgets")
            .update({
              amount,
              date,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id!)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Budgets", "Dashboard"],
    }),
    deleteBudget: builder.mutation({
      queryFn: async (ids: number[]) => {
        try {
          const { error } = await supabase
            .from("budgets")
            .delete()
            .in("id", ids)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Budgets", "Dashboard"],
    }),

    getConstant: builder.query({
      queryFn: async (filters: ConstantFilters) => {
        try {
          const { page, page_size, constant_type, search, date_from, date_to } =
            filters

          let query = supabase
            .from("constants")
            .select("*", { count: "exact" })
            .range((page - 1) * page_size, page_size * page - 1)
            .order("date", { ascending: false })

          if (search) {
            query = query.ilike("constant_name", `%${search}%`)
          }

          if (constant_type && constant_type?.length > 0) {
            query = query.in("constant_type", constant_type)
          }

          if (date_from && date_to) {
            query = query.gte("date", date_from).lte("date", date_to)
          }

          const [
            { data, error, count },
            { data: profileData, error: profileError },
          ] = await Promise.all([
            query,
            supabase.from("user_profiles").select("expense_types").single(),
          ])

          if (error) throw error
          if (profileError) throw profileError

          return {
            data: {
              constants: data,
              constantTypeMap: profileData.expense_types as ConstantTypeMap,
              total: count,
            },
          }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      providesTags: ["Constants"],
    }),
    addConstant: builder.mutation({
      queryFn: async (params: InsertConstant) => {
        try {
          const { constant_name, constant_type, amount, date } = params

          const { error } = await supabase
            .from("constants")
            .insert({ constant_name, constant_type, amount, date })

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Constants", "Dashboard"],
    }),
    updateConstant: builder.mutation({
      queryFn: async (params: UpdateConstant) => {
        try {
          const { id, constant_name, constant_type, amount, date } = params

          const { error } = await supabase
            .from("constants")
            .update({
              constant_name,
              constant_type,
              amount,
              date,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id!)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Constants", "Dashboard"],
    }),
    deleteConstant: builder.mutation({
      queryFn: async (ids: number[]) => {
        try {
          const { error } = await supabase
            .from("constants")
            .delete()
            .in("id", ids)

          if (error) throw error

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          }
        }
      },
      invalidatesTags: ["Constants", "Dashboard"],
    }),
  }),
})

export const {
  useGetDashboardQuery,
  useGetExpenseTypeQuery,
  useAddExpenseMutation,
  useGetExpenseQuery,
  useEditExpenseMutation,
  useDeleteExpenseMutation,
  useGetSavingsQuery,
  useGetSavingsForQuery,
  useAddSavingsMutation,
  useUpdateSavingsMutation,
  useDeleteSavingsMutation,
  useGetBudgetQuery,
  useAddBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
  useGetConstantQuery,
  useAddConstantMutation,
  useUpdateConstantMutation,
  useDeleteConstantMutation,
} = supabaseApi
