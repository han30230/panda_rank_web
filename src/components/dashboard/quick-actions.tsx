import Link from "next/link"
import { FileEdit, GitCompare, ScanSearch, Sparkles } from "lucide-react"

import { quickActions } from "@/constants/dashboard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const iconMap = {
  kw: ScanSearch,
  content: FileEdit,
  compare: GitCompare,
  extract: Sparkles,
} as const

export function QuickActions() {
  return (
    <Card className="surface-analytics rounded-[1.05rem] px-6 py-7 md:px-8 md:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge
            variant="secondary"
            className="mb-2 w-fit border border-border/50 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary"
          >
            시작
          </Badge>
          <p className="text-lg font-semibold tracking-tight">지금 할 일</p>
          <p className="text-muted-foreground mt-1 max-w-lg text-sm leading-relaxed">
            가장 자주 쓰는 네 가지를 상단에 고정했습니다. 첫 버튼이 기본 추천 경로입니다.
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {quickActions.map((a) => {
          const Icon = iconMap[a.id as keyof typeof iconMap] ?? ScanSearch
          return (
            <Button
              key={a.id}
              variant={a.primary ? "default" : "outline"}
              className="h-auto flex-col items-start gap-1.5 rounded-xl border-border/80 py-4 whitespace-normal shadow-sm"
              asChild
            >
              <Link href={a.href}>
                <span className="flex w-full items-center gap-2 text-sm font-semibold">
                  <Icon className="size-4 shrink-0 opacity-90" />
                  {a.label}
                </span>
                <span
                  className={
                    a.primary
                      ? "text-primary-foreground/85 w-full text-left text-xs font-normal leading-snug"
                      : "text-muted-foreground w-full text-left text-xs font-normal leading-snug"
                  }
                >
                  {a.description}
                </span>
              </Link>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
