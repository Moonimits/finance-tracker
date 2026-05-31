import FormDatePicker from "@/components/shared/forms/FormDatePicker"
import FormInput from "@/components/shared/forms/FormInput"
import FormSelect from "@/components/shared/forms/FormSelect"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import {
  useAddExpenseMutation,
  useEditExpenseMutation,
  useGetExpenseTypeQuery,
} from "@/store/api/supabaseApi"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { closeModal } from "@/store/slice/modalSlice"
import type { Expense, ExpenseTypeMeta } from "@/types/expenseTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { FormProvider, useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const expenseSchema = z.object({
  expenseName: z.string().min(1, "Must have expense name"),
  amount: z.coerce.number().min(1, "Must have an amount greater than 0"),
  expenseType: z.string().min(1, "Must choose an expense type"),
  date: z.coerce.date(),
})

type ExpenseForm = z.infer<typeof expenseSchema>

const ExpenseForm = () => {
  const { data: modalData } = useAppSelector((state) => state.modal)
  const [addExpense] = useAddExpenseMutation()
  const [editExpense] = useEditExpenseMutation()
  const dispatch = useAppDispatch()

  const { data } = useGetExpenseTypeQuery()
  const expenseTypes = data?.expense_types ?? {}
  const expense = modalData as Expense
  const isEditing = !!expense

  const form = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema) as Resolver<ExpenseForm>,
    defaultValues: {
      expenseName: expense?.expense_name ?? "",
      amount: expense?.amount ?? ("" as unknown as number),
      expenseType: expense?.expense_type ?? "",
      date: expense?.date ? new Date(expense.date) : new Date(),
    },
  })

  const onSubmit = async (formData: ExpenseForm) => {
    try {
      if (isEditing) {
        await editExpense({
          id: expense.id,
          expense_name: formData.expenseName,
          amount: formData.amount,
          expense_type: formData.expenseType,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      } else {
        await addExpense({
          expense_name: formData.expenseName,
          amount: formData.amount,
          expense_type: formData.expenseType,
          date: format(formData.date, "y-MM-dd"),
        }).unwrap()
      }

      toast.success(
        isEditing ? "Edit Expense Successful" : "Add Expense Successful"
      )
      dispatch(closeModal())
    } catch (error) {
      toast.error(isEditing ? "Edit Expense Failed" : "Add Expense Failed")
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <form id="expenseForm" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput<ExpenseForm>
              name="expenseName"
              label="Expense Name"
              placeholder="e.g. Groceries"
              isRequired={true}
            />

            <FormInput<ExpenseForm>
              name="amount"
              label="Amount"
              type="number"
              placeholder="e.g. 1200"
              isRequired={true}
            />

            <FormSelect<ExpenseForm, ExpenseTypeMeta>
              name="expenseType"
              items={expenseTypes}
              label="Expense Type"
              placeholder="Select a Expense Type"
              isRequired={true}
            />

            <FormDatePicker<ExpenseForm> name="date" label="Date" />
          </FieldGroup>
        </form>
      </FormProvider>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button form="expenseForm" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? isEditing
              ? "Editing Expense..."
              : "Adding Expense..."
            : isEditing
              ? "Edit Expense"
              : "Add Expense"}
        </Button>
      </DialogFooter>
    </>
  )
}

export default ExpenseForm
