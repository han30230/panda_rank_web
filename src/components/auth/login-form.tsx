"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useAuth } from "@/contexts/auth-context"
import { userExists } from "@/lib/local-auth"
import { safeRedirectPath } from "@/lib/safe-redirect"
import { loginSchema, type LoginValues } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, ready, login, signUp } = useAuth()

  const DEMO = {
    email: "demo@rankdeck.local",
    password: "demo12345",
    name: "데모 사용자",
  } as const

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    if (!ready || !user) return
    router.replace(safeRedirectPath(searchParams.get("redirect")))
  }, [ready, user, router, searchParams])

  function onSubmit(data: LoginValues) {
    try {
      login(data.email, data.password)
      toast.success("로그인되었습니다.")
      router.push(safeRedirectPath(searchParams.get("redirect")))
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "로그인에 실패했습니다.")
    }
  }

  function onDemoLogin() {
    try {
      if (!userExists(DEMO.email)) {
        signUp({
          email: DEMO.email,
          password: DEMO.password,
          name: DEMO.name,
        })
      } else {
        login(DEMO.email, DEMO.password)
      }
      toast.success("데모 계정으로 로그인했습니다.")
      router.push(safeRedirectPath(searchParams.get("redirect")))
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "데모 로그인에 실패했습니다.")
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded-xl"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">비밀번호</Label>
          <Link
            href="/forgot-password"
            className="text-primary text-xs font-medium hover:underline"
          >
            찾기
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className="rounded-xl"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? "확인 중…" : "로그인"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="h-10 w-full rounded-xl text-sm"
        onClick={onDemoLogin}
      >
        데모 계정으로 바로 로그인
      </Button>
    </form>
  )
}
