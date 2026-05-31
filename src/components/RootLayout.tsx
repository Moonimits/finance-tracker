import GlobalModal from "@/components/shared/GlobalModal"
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background text-foreground">
      <Outlet />
      <Toaster position="top-right" richColors />
      <GlobalModal />
    </div>
  )
}

export default RootLayout
