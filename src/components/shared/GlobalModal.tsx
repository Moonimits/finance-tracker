import BudgetForm from "@/components/modal-contents/BudgetForm"
import ConstantForm from "@/components/modal-contents/ConstantForm"
import ExpenseForm from "@/components/modal-contents/ExpenseForm"
import SavingsForm from "@/components/modal-contents/SavingsForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { closeModal } from "@/store/slice/modalSlice"

export const MODAL_CONTENT = {
  expenseForm: <ExpenseForm />,
  savingsForm: <SavingsForm />,
  budgetForm: <BudgetForm />,
  constantForm: <ConstantForm />,
}

const GlobalModal = () => {
  const { title, description, content, isOpen } = useAppSelector(
    (state) => state.modal
  )
  const dispatch = useAppDispatch()

  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {content && MODAL_CONTENT[content]}
      </DialogContent>
    </Dialog>
  )
}

export default GlobalModal
