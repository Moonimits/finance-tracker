import type { Modal } from "@/types/modalTypes"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type ModalState = Modal

const initialState: ModalState = {
  title: "",
  description: "",
  content: null,
  data: null,
  isOpen: false,
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (_, action: PayloadAction<Omit<ModalState, "isOpen">>) => {
      return { ...action.payload, isOpen: true }
    },
    closeModal: (state) => {
      state.title = ""
      state.description = ""
      state.content = null
      state.data = null
      state.isOpen = false
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
