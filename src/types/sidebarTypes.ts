import type { ReactNode } from "react"

export type MenuItem = {
  label: string
  icon: ReactNode
  link: string
  submenu?: SubMenuItem
  action?: () => void
}

export type SubMenuItem = {
  label: string
  icon: ReactNode
  link?: string
  action?: () => void
}

export type SidebarNav = {
  groupLabel: string
  menu: MenuItem[]
}
