"use client"

import Link from "next/link"
import { Suspense } from "react"

import { LoginForm } from "@/components/auth/login-form"
import { OauthButtons } from "@/components/auth/oauth-buttons"
import { siteConfig } from "@/lib/site-config"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function FormFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  )
}

export function LoginPageClient() {
  return (
    <div className="grid min-h-[calc(100dvh-3.5rem)] lg:grid-cols-2">
      <div className="bg-muted/30 relative hidden flex-col justify-between p-12 lg:flex">
        <div>
          <p className="text-sm font-semibold">{siteConfig.name}</p>
          <h2 className="mt-8 max-w-md text-3xl font-semibold tracking-tight">
            분석과 초안이 같은 타임라인에 머무릅니다
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
            팀이 컨텍스트를 잃지 않도록 상태를 한 화면에 모았습니다.
          </p>
        </div>
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,oklch(0.52_0.12_175/0.12),transparent)]"
          aria-hidden
        />
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md rounded-3xl border-border/80 p-8 shadow-lg">
          <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            이메일과 비밀번호를 입력하세요.
          </p>
          <OauthButtons variant="login" />
          <div className="text-muted-foreground relative my-6 text-center text-xs">
            <span className="bg-card relative z-10 px-2">또는 이메일</span>
            <span className="bg-border absolute top-1/2 right-0 left-0 -z-0 h-px" />
          </div>
          <Suspense fallback={<FormFallback />}>
            <LoginForm />
          </Suspense>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            계정이 없나요?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
