import type { MODAL_CONTENT } from "@/components/shared/GlobalModal"

type ModalContent = keyof typeof MODAL_CONTENT

export type Modal = {
  title: string
  description?: string
  content?: ModalContent | null
  data?: unknown
  isOpen: boolean
}
