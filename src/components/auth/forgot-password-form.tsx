"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: ForgotPasswordValues) {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    })
    const payload = (await res.json().catch(() => ({}))) as {
      message?: string
      devResetPath?: string
      error?: unknown
    }
    if (!res.ok) {
      toast.error(typeof payload.error === "string" ? payload.error : "요청에 실패했습니다.")
      return
    }
    toast.success(payload.message ?? "요청을 접수했습니다.")
    if (payload.devResetPath && typeof window !== "undefined") {
      const full = `${window.location.origin}${payload.devResetPath}`
      toast.message("개발 모드: 아래 주소로 새 비밀번호를 설정할 수 있습니다.", {
        description: full,
        duration: 25_000,
      })
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="reset-email">이메일</Label>
        <Input
          id="reset-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="rounded-xl"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? "보내는 중…" : "재설정 링크 보내기"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </form>
  )
}
