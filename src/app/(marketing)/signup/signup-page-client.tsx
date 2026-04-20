"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

import { OauthButtons } from "@/components/auth/oauth-buttons"
import { SignupForm } from "@/components/auth/signup-form"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function SignupAlreadyLoggedInGate({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth()
  const router = useRouter()
  const checked = useRef(false)

  useEffect(() => {
    if (!ready) return
    if (checked.current) return
    checked.current = true
    if (user) {
      router.replace("/dashboard")
    }
  }, [ready, user, router])

  if (!ready) {
    return (
      <div className="mt-6 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    )
  }
  if (user) {
    return (
      <div className="text-muted-foreground mt-6 text-center text-sm">이동 중…</div>
    )
  }
  return <>{children}</>
}

export function SignupPageClient() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-border/80 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">계정 만들기</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          7일 동안 핵심 기능을 제한적으로 무료로 씁니다.
        </p>
        <div className="mt-6">
          <OauthButtons variant="signup" />
        </div>
        <div className="text-muted-foreground relative my-6 text-center text-xs">
          <span className="bg-card relative z-10 px-2">또는 이메일</span>
          <span className="bg-border absolute top-1/2 right-0 left-0 -z-0 h-px" />
        </div>
        <SignupAlreadyLoggedInGate>
          <SignupForm />
        </SignupAlreadyLoggedInGate>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            로그인
          </Link>
        </p>
      </Card>
    </div>
  )
}
