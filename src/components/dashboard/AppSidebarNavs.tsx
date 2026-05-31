import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { SidebarNav } from "@/types/sidebarTypes"
import { SquarePlus } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const AppSidebarNavs = ({ sidebarGroup }: { sidebarGroup: SidebarNav }) => {
  const path = useLocation()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{sidebarGroup.groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarGroup.menu.map((menu, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild isActive={path.pathname === menu.link}>
                <Link to={menu.link}>
                  {menu.icon}
                  {menu.label}
                </Link>
              </SidebarMenuButton>
              {menu?.action && (
                <SidebarMenuAction showOnHover onClick={menu.action}>
                  <SquarePlus />
                </SidebarMenuAction>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AppSidebarNavs
