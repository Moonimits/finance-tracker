import AppSidebarFooter from "@/components/dashboard/AppSidebarFooter"
import AppSidebarNavs from "@/components/dashboard/AppSidebarNavs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useModal from "@/hooks/useModal"
import type { SidebarNav } from "@/types/sidebarTypes"
import {
  BanknoteArrowDown,
  HandCoins,
  LayoutDashboard,
  PiggyBank,
  Wallet,
} from "lucide-react"

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { openAddBudget, openAddConstant, openAddExpense, openAddSavings } =
    useModal()

  const SIDEBAR_NAVS: SidebarNav[] = [
    {
      groupLabel: "Dashboard",
      menu: [
        {
          label: "Dashboard",
          link: "/",
          icon: <LayoutDashboard />,
        },
      ],
    },
    {
      groupLabel: "Finance",
      menu: [
        {
          label: "Expenses",
          link: "/expense",
          icon: <BanknoteArrowDown />,
          action: openAddExpense,
        },
        {
          label: "Savings",
          link: "/savings",
          icon: <PiggyBank />,
          action: openAddSavings,
        },
        {
          label: "Budgets",
          link: "/budget",
          icon: <HandCoins />,
          action: openAddBudget,
        },
        {
          label: "Constants",
          link: "/constant",
          icon: <BanknoteArrowDown />,
          action: openAddConstant,
        },
      ],
    },
  ]
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded bg-primary">
                <Wallet className="size-5!" />
              </div>
              <div className="grid grid-cols-1">
                <span className="truncate font-medium">Finance Tracker</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_NAVS.map((group, index) => (
          <AppSidebarNavs sidebarGroup={group} key={index} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
