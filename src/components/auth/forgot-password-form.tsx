"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { userExists } from "@/lib/local-auth"
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

  function onSubmit(data: ForgotPasswordValues) {
    const exists = userExists(data.email)
    toast.success(
      exists
        ? "재설정 링크를 보냈습니다. 메일함을 확인해 주세요."
        : "요청을 접수했습니다. 등록된 이메일이면 안내를 보냅니다.",
      { description: "데모 환경에서는 실제 메일이 발송되지 않습니다." },
    )
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
