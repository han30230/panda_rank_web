"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { AppHeader } from "@/components/app/app-header"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function DashboardPageHeader() {
  const { user } = useAuth()
  const description = user
    ? `오늘의 작업과 사용량을 확인하세요 · ${user.name}님`
    : "오늘의 작업과 사용량을 확인하세요."

  return (
    <AppHeader
      title="홈"
      description={description}
      action={
        <Button size="sm" className="rounded-full px-4 font-semibold shadow-sm" asChild>
          <Link href="/workspace/new">
            <Plus className="size-4" />
            새 작업
          </Link>
        </Button>
      }
    />
  )
}
