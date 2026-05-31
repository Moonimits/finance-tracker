import useAuth from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

const GuestRoute = () => {
  const { authUser } = useAuth()

  if (authUser) return <Navigate to="/" />

  return <Outlet />
}

export default GuestRoute
