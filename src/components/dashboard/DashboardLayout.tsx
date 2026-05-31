import AppSidebar from "@/components/dashboard/AppSidebar"
import Navbar from "@/components/dashboard/Navbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Navbar />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
