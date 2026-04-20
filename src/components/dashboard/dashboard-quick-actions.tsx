import Link from "next/link"
import { FileEdit, GitCompare, ScanSearch, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const actions = [
  {
    href: "/analyze/keyword",
    label: "새 키워드 분석",
    description: "의도·연관어·제목 각도",
    icon: ScanSearch,
    primary: true,
  },
  {
    href: "/content/new",
    label: "새 글 생성",
    description: "톤·길이·점수 피드백",
    icon: FileEdit,
    primary: false,
  },
  {
    href: "/workspace/new",
    label: "URL·글 비교",
    description: "새 작업에서 선택",
    icon: GitCompare,
    primary: false,
  },
  {
    href: "/analyze/keyword",
    label: "키워드 추출",
    description: "본문 붙여넣기",
    icon: Sparkles,
    primary: false,
  },
]

export function DashboardQuickActions() {
  return (
    <Card className="surface-card rounded-[1.05rem] px-6 py-7 md:px-8 md:py-8">
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
        {actions.map((a) => (
          <Button
            key={a.label}
            variant={a.primary ? "default" : "outline"}
            className="h-auto flex-col items-start gap-1.5 rounded-xl border-border/80 py-4 whitespace-normal shadow-sm"
            asChild
          >
            <Link href={a.href}>
              <span className="flex w-full items-center gap-2 text-sm font-semibold">
                <a.icon className="size-4 shrink-0 opacity-90" />
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
        ))}
      </div>
    </Card>
  )
}
