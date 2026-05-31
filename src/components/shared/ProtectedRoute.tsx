import useAuth from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const { authUser } = useAuth()

  if (!authUser) return <Navigate to="/login" />

  return <Outlet />
}

export default ProtectedRoute
