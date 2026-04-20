import Link from "next/link"
import { FileEdit, ScanSearch, Sparkles } from "lucide-react"

import { AppHeader } from "@/components/app/app-header"
import { Card } from "@/components/ui/card"

const tiles = [
  {
    href: "/analyze/keyword",
    title: "키워드·주제 분석",
    body: "의도와 각도를 먼저 고릅니다.",
    icon: ScanSearch,
  },
  {
    href: "/content/new",
    title: "콘텐츠 작성",
    body: "개요를 승인하고 초안을 생성합니다.",
    icon: FileEdit,
  },
  {
    href: "/dashboard",
    title: "대시보드로",
    body: "진행 중인 작업을 이어서 처리합니다.",
    icon: Sparkles,
  },
]

export default function NewWorkspacePage() {
  return (
    <>
      <AppHeader
        title="새 작업"
        description="시작 지점을 고르면 동일한 레이아웃으로 이어집니다."
      />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="grid gap-4">
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className="group block">
              <Card className="rounded-2xl border-border/80 p-6 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <t.icon className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{t.title}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{t.body}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
