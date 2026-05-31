import { supabase } from "@/lib/supabase"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { setAuth } from "@/store/slice/authSlice"
import type {
  SignInCredentials,
  SignUpCredentials,
  User,
} from "@/types/authTypes"
import { toast } from "sonner"

const useAuth = () => {
  const { authUser, loading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      dispatch(
        setAuth({
          id: user?.id!,
          email: user?.user_metadata?.email,
          username: user?.user_metadata?.username,
          profile_img: user?.user_metadata?.avatar_url ?? "",
        })
      )
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" })
    }
  }

  const signUp = async ({ email, password, username }: SignUpCredentials) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) throw error

      dispatch(
        setAuth({
          id: user?.id!,
          email: user?.user_metadata?.email,
          username: user?.user_metadata?.username,
          profile_img: user?.user_metadata?.avatar_url ?? "",
        })
      )
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" })
    }
  }

  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
      })
    } catch (error: any) {
      toast.error(error.message, { position: "top-center" })
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      toast.error("Error in Sign Out", { position: "top-center" })
    }
  }

  const checkAuth = async (user: User | null) => {
    try {
      dispatch(setAuth(user))
    } catch (error) {
      toast.error("Error in Check Auth", { position: "top-center" })
    }
  }

  return {
    authUser,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    checkAuth,
  }
}

export default useAuth
