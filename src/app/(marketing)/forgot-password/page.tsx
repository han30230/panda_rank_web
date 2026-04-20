import type { Metadata } from "next"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Card } from "@/components/ui/card"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "비밀번호 찾기",
  description: `${siteConfig.name} 계정 비밀번호 재설정을 안내합니다.`,
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-border/80 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">비밀번호 재설정</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          가입 시 사용한 이메일을 입력하면 재설정 링크를 보내 드립니다. (데모 화면 — 실제 메일은 연동 후
          발송됩니다.)
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </Card>
    </div>
  )
}
