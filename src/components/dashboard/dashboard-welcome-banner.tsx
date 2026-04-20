"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Sparkles, X } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

type Props = {
  initialDismissed: boolean
}

export function DashboardWelcomeBanner({ initialDismissed }: Props) {
  const router = useRouter()
  const { user, ready } = useAuth()
  const [localDismissed, setLocalDismissed] = useState(false)

  const dismissed =
    initialDismissed ||
    localDismissed ||
    (ready && user?.dashboardWelcomeDismissed === true)

  useEffect(() => {
    setLocalDismissed(false)
  }, [initialDismissed])

  const dismiss = useCallback(async () => {
    setLocalDismissed(true)
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboardWelcomeDismissed: true }),
      })
      router.refresh()
    } catch {
      /* ignore */
    }
  }, [router])

  if (dismissed) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.07] via-card to-muted/40 px-4 py-4 shadow-sm">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/60 to-primary/20"
        aria-hidden
      />
      <div className="flex flex-wrap items-center justify-between gap-3 pl-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="bg-primary/15 text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-foreground">여기서부터 시작해 보세요.</span>{" "}
            <span className="text-muted-foreground">
              키워드 한 번만 넣어도 의도·점수·초안 흐름이 한 화면에 쌓입니다. 부담 없이 첫 분석을
              끝내 보세요.
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" className="rounded-full font-semibold shadow-sm" asChild>
            <Link href="/analyze/keyword">첫 키워드 분석</Link>
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="shrink-0 rounded-full"
            type="button"
            onClick={() => void dismiss()}
            aria-label="배너 닫기"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
