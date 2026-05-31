import DashboardLayout from "@/components/dashboard/DashboardLayout"
import RootLayout from "@/components/RootLayout"
import GuestRoute from "@/components/shared/GuestRoute"
import ProtectedRoute from "@/components/shared/ProtectedRoute"
import useAuth from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import BudgetPage from "@/pages/BudgetPage"
import ConstantPage from "@/pages/ConstantPage"
import DashboardPage from "@/pages/DashboardPage"
import ExpensePage from "@/pages/ExpensePage"
import LoadingPage from "@/pages/LoadingPage"
import LoginPage from "@/pages/LoginPage"
import ProfilePage from "@/pages/ProfilePage"
import SavingsPage from "@/pages/SavingsPage"
import SignupPage from "@/pages/SignupPage"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"

export function App() {
  const { loading, checkAuth } = useAuth()

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        const { id, user_metadata } = session.user
        checkAuth({
          id,
          email: user_metadata?.email,
          username: user_metadata.username ?? user_metadata.name,
          profile_img: user_metadata.avatar_url ?? "",
        })
      } else {
        checkAuth(null)
      }
    })
  }, [])

  if (loading) return <LoadingPage />

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expense" element={<ExpensePage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/constant" element={<ConstantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
