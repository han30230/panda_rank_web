"use client"

import { useSearchParams } from "next/navigation"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")?.trim() ?? ""

  if (!token) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        유효한 재설정 링크가 아닙니다.{" "}
        <a href="/forgot-password" className="text-primary font-medium underline underline-offset-4">
          비밀번호 찾기
        </a>
        를 다시 요청해 주세요.
      </p>
    )
  }

  return <ResetPasswordForm token={token} />
}
