import { Bell, Search } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = [
  { type: "분석", title: "겨울 캠핑 장비", status: "완료", date: "오늘" },
  { type: "초안", title: "지역 맛집 리스트", status: "검토", date: "어제" },
  { type: "분석", title: "무선 이어폰 비교", status: "실행중", date: "어제" },
]

export function DashboardPreviewSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            대시보드에서 상태가 이어집니다
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            KPI, 최근 작업, 추천 액션을 한 스크린에 모았습니다.
          </p>
        </div>
        <Card className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border-border/80 shadow-xl shadow-foreground/5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3 md:px-6">
            <div className="text-muted-foreground flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-background px-3 py-2 text-sm">
              <Search className="size-4 shrink-0" />
              <span className="truncate">작업 검색…</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" aria-label="알림">
                <Bell className="size-4" />
              </Button>
              <Avatar className="size-8">
                <AvatarFallback>RD</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
            <aside className="border-border/60 bg-muted/20 hidden lg:block lg:border-r">
              <nav className="space-y-1 p-4 text-sm">
                {["홈", "새 작업", "분석", "콘텐츠", "리포트", "설정"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2 ${i === 0 ? "bg-background font-medium shadow-sm" : "text-muted-foreground"}`}
                    >
                      {item}
                    </div>
                  ),
                )}
              </nav>
            </aside>
            <div className="p-4 md:p-6">
              <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
                {["홈", "분석", "콘텐츠"].map((c) => (
                  <Badge key={c} variant="secondary" className="rounded-full">
                    {c}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "이번 주 분석", value: "24", delta: "+12%" },
                  { label: "생성 초안", value: "8", delta: "3개 검토중" },
                  { label: "남은 크레딧", value: "640", delta: "팀 플랜" },
                ].map((k) => (
                  <Card
                    key={k.label}
                    className="rounded-2xl border-border/70 p-4 shadow-sm"
                  >
                    <p className="text-muted-foreground text-xs font-medium">
                      {k.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                      {k.value}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">{k.delta}</p>
                  </Card>
                ))}
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Card className="rounded-2xl border-border/70 p-0 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                    <p className="text-sm font-medium">최근 작업</p>
                    <Button variant="link" className="h-auto p-0 text-xs" asChild>
                      <Link href="/dashboard">전체</Link>
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">유형</TableHead>
                        <TableHead className="text-xs">제목</TableHead>
                        <TableHead className="text-xs">상태</TableHead>
                        <TableHead className="text-right text-xs">일자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((r) => (
                        <TableRow key={r.title}>
                          <TableCell className="text-xs">{r.type}</TableCell>
                          <TableCell className="max-w-[140px] truncate text-xs font-medium sm:max-w-none">
                            {r.title}
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className="font-normal">
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs tabular-nums">
                            {r.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
                <Card className="rounded-2xl border-border/70 p-5 shadow-sm">
                  <p className="text-sm font-medium">추천 액션</p>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="bg-muted/50 rounded-xl p-3">
                      <p className="font-medium">초안 v2 검토</p>
                      <p className="text-muted-foreground text-xs">
                        메타 길이가 권장을 넘었습니다.
                      </p>
                    </li>
                    <li className="bg-muted/50 rounded-xl p-3">
                      <p className="font-medium">키워드 확장</p>
                      <p className="text-muted-foreground text-xs">
                        연관 질문 4개가 추가되었습니다.
                      </p>
                    </li>
                  </ul>
                  <Button className="mt-5 w-full rounded-full" asChild>
                    <Link href="/signup">무료로 시작</Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
