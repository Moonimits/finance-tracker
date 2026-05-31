import RangeDatePicker from "@/components/shared/RangeDatePicker"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

const LOCATION_MAP = {
  "/": "Dashboard",
  "/expense": "Expenses",
  "/savings": "Savings",
  "/budget": "Budget",
  "/constant": "Constant",
  "/profile": "Profile",
}

const Navbar = () => {
  const { pathname } = useLocation()
  const path = pathname as keyof typeof LOCATION_MAP

  return (
    <header className="mb-2 border-b px-2 py-1.5">
      <div className="flex gap-1">
        <SidebarTrigger />
        <h1 className="text-xl font-bold">
          {LOCATION_MAP[path] ? LOCATION_MAP[path] : "Unknown"}
        </h1>
        <div className="ml-auto">
          <RangeDatePicker />
        </div>
      </div>
    </header>
  )
}

export default Navbar
