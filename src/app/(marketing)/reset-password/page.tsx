import type { Metadata } from "next"
import { Suspense } from "react"

import { ResetPasswordClient } from "./reset-password-client"
import { Card } from "@/components/ui/card"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "새 비밀번호 설정",
  description: `${siteConfig.name} 계정의 새 비밀번호를 설정합니다.`,
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-border/80 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">새 비밀번호 설정</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          메일로 받은 링크에서만 이 화면이 열립니다. 새 비밀번호를 입력한 뒤 로그인해 주세요.
        </p>
        <div className="mt-6">
          <Suspense
            fallback={<p className="text-muted-foreground text-sm">불러오는 중…</p>}
          >
            <ResetPasswordClient />
          </Suspense>
        </div>
      </Card>
    </div>
  )
}
