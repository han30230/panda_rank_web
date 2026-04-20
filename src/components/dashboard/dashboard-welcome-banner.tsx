"use client"

import Link from "next/link"
import { useCallback, useSyncExternalStore } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "rankdeck_dashboard_welcome_dismissed"
const BANNER_EVENT = "rankdeck-banner-dismiss"

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {}
  const handler = () => onChange()
  window.addEventListener("storage", handler)
  window.addEventListener(BANNER_EVENT, handler)
  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener(BANNER_EVENT, handler)
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

function getServerSnapshot() {
  return false
}

export function DashboardWelcomeBanner() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(BANNER_EVENT))
  }, [])

  if (dismissed) return null

  return (
    <div className="border-border/80 bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3">
      <p className="text-sm">
        <span className="font-medium">첫 키워드 분석</span>
        <span className="text-muted-foreground">
          을 완료하면 이 영역이 최근 작업 요약으로 바뀝니다. 지금 바로 시작해 보세요.
        </span>
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" className="rounded-full" asChild>
          <Link href="/analyze/keyword">키워드 분석 시작</Link>
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          className="shrink-0 rounded-full"
          type="button"
          onClick={dismiss}
          aria-label="배너 닫기"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
