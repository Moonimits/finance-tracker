import { useAppDispatch } from "@/store/hook"
import { openModal } from "@/store/slice/modalSlice"
import type { UpdateBudget } from "@/types/budgetTypes"
import type { UpdateConstant } from "@/types/constatTypes"
import type { UpdateExpense } from "@/types/expenseTypes"
import type { UpdateSavings } from "@/types/savingsTypes"

const useModal = () => {
  const dispatch = useAppDispatch()

  const openAddExpense = () => {
    dispatch(
      openModal({
        title: "Add Expense",
        description: "Input your expense's details",
        content: "expenseForm",
      })
    )
  }

  const openEditExpense = (params: UpdateExpense) => {
    dispatch(
      openModal({
        title: "Edit Expense",
        description: "Change your expense's details",
        content: "expenseForm",
        data: { ...params },
      })
    )
  }

  const openAddSavings = () => {
    dispatch(
      openModal({
        title: "Add Savings",
        description: "Input your savings's details",
        content: "savingsForm",
      })
    )
  }

  const openEditSavings = (params: UpdateSavings) => {
    dispatch(
      openModal({
        title: "Edit Savings",
        description: "Change your savings's details",
        content: "savingsForm",
        data: { ...params },
      })
    )
  }

  const openAddBudget = () => {
    dispatch(
      openModal({
        title: "Add Budget",
        description: "Input your budget's details",
        content: "budgetForm",
      })
    )
  }

  const openEditBudget = (params: UpdateBudget) => {
    dispatch(
      openModal({
        title: "Edit Budget",
        description: "Input your budget's details",
        content: "budgetForm",
        data: { ...params },
      })
    )
  }

  const openAddConstant = () => {
    dispatch(
      openModal({
        title: "Add Constant",
        description: "Input your constant expenses per month",
        content: "constantForm",
      })
    )
  }

  const openEditConstant = (params: UpdateConstant) => {
    dispatch(
      openModal({
        title: "Edit Constant",
        description: "Change your constant expense's details ",
        content: "constantForm",
        data: { ...params },
      })
    )
  }

  return {
    openAddExpense,
    openAddSavings,
    openAddBudget,
    openAddConstant,
    openEditExpense,
    openEditSavings,
    openEditBudget,
    openEditConstant,
  }
}

export default useModal
