import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail, Wallet } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router-dom"

import * as z from "zod"

const loginSchema = z.object({
  email: z.string().email().min(1, "Must have an email"),
  password: z.string().min(8, "Password must have atleast 8 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage = () => {
  const { signIn, signInWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const onSubmit = async (rawData: LoginForm) => {
    await signIn(rawData)
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 h-125 w-125 -translate-1/2 rounded-full bg-green-400/50 blur-[250px]"></div>
      <div className="absolute right-0 bottom-0 h-125 w-125 translate-1/2 rounded-full bg-green-400/50 blur-[250px]"></div>

      <Card className="relative w-100 bg-transparent backdrop-blur-2xl">
        <CardHeader className="text-center">
          <CardTitle className="mb-2 text-2xl">
            <span className="inline-flex items-center gap-3">
              <span className="rounded border bg-primary p-1.5">
                <Wallet />
              </span>
              Finance Tracker
            </span>
          </CardTitle>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Login to continue keeping track of your expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1.5 left-2 size-5 text-foreground/60" />
                      <Input
                        id="email"
                        {...field}
                        placeholder="m@example.com"
                        className="pl-8"
                        required
                      />
                    </div>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute top-1.5 left-2 size-5 text-foreground/60" />

                      <Input
                        id="password"
                        {...field}
                        type={!showPassword ? "password" : "text"}
                        className="px-8"
                        placeholder="e.g. password123"
                        required
                      />
                      <span
                        onClick={handleShowPassword}
                        className="absolute top-1.5 right-2 flex cursor-pointer items-center text-foreground/60"
                      >
                        {!showPassword ? (
                          <Eye className="size-5" />
                        ) : (
                          <EyeOff className="size-5" />
                        )}
                      </span>
                    </div>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
                <FieldSeparator className="my-2">Continue with</FieldSeparator>
                <Button
                  onClick={signInWithGoogle}
                  variant="outline"
                  type="button"
                >
                  Signin with Google
                </Button>
                <FieldDescription className="text-center">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
