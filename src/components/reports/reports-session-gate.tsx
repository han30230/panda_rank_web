"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Skeleton } from "@/components/ui/skeleton"

export function ReportsSessionGate() {
  const router = useRouter()
  useEffect(() => {
    void fetch("/api/auth/me", { credentials: "include" }).then(() => {
      router.refresh()
    })
  }, [router])

  return (
    <div className="app-content-shell flex-1 space-y-4 p-4 md:p-6">
      <Skeleton className="h-40 rounded-2xl" />
      <p className="text-muted-foreground text-sm">세션을 준비하는 중입니다…</p>
    </div>
  )
}
