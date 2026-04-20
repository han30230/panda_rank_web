import Link from "next/link"
import { Plus } from "lucide-react"

import { AppHeader } from "@/components/app/app-header"
import { DashboardActivityChart } from "@/components/dashboard/dashboard-activity-chart"
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions"
import { DashboardWelcomeBanner } from "@/components/dashboard/dashboard-welcome-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const recent = [
  {
    type: "분석",
    title: "캠핑용 버너 추천",
    status: "실행중",
    date: "4월 18일",
    reportId: "r_kw_91bc",
  },
  {
    type: "초안",
    title: "재택근무 생산성 가이드",
    status: "검토",
    date: "4월 17일",
    reportId: "r_ct_draft_2",
  },
  {
    type: "분석",
    title: "미니멀 책상 정리",
    status: "완료",
    date: "4월 16일",
    reportId: "r_kw_7f3a",
  },
] as const

export default function DashboardPage() {
  return (
    <>
      <AppHeader
        title="홈"
        description="오늘의 작업과 사용량을 확인하세요."
        action={
          <Button size="sm" className="rounded-full px-4 font-semibold shadow-sm" asChild>
            <Link href="/workspace/new">
              <Plus className="size-4" />
              새 작업
            </Link>
          </Button>
        }
      />
      <div className="app-content-shell space-y-10">
        <section aria-label="온보딩 안내">
          <DashboardWelcomeBanner />
        </section>

        <section aria-label="주요 작업">
          <DashboardQuickActions />
        </section>

        <section aria-label="요약 지표">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              { label: "이번 주 분석", value: "18", hint: "목표 대비 92%" },
              { label: "평균 SEO 점수", value: "76", hint: "가이드 기준" },
              { label: "저장된 초안", value: "6", hint: "2건 피드백 대기" },
              { label: "크레딧", value: "3,420", hint: "프로 플랜" },
            ].map((k) => (
              <Card
                key={k.label}
                className="surface-card rounded-[1.05rem] px-6 py-6 md:px-7 md:py-7"
              >
                <p className="text-caption font-medium">{k.label}</p>
                <p className="mt-3 text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight">
                  {k.value}
                </p>
                <p className="text-muted-foreground mt-2.5 text-[11px] leading-snug">{k.hint}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="추이·크레딧">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <DashboardActivityChart />
            </div>
            <Card className="surface-card flex flex-col justify-center rounded-[1.05rem] px-6 py-7">
              <p className="text-sm font-semibold">이번 달 크레딧</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                68% 사용 · 한도에 가까워지면 알림을 보냅니다.
              </p>
              <Progress value={68} className="mt-5 h-2" />
              <Button
                size="sm"
                variant="outline"
                className="mt-5 w-full rounded-full border-border/80 bg-background font-medium"
                asChild
              >
                <Link href="/settings/billing">플랜 조정</Link>
              </Button>
            </Card>
          </div>
        </section>

        <section aria-label="작업 목록" className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <Card className="surface-card overflow-hidden rounded-[1.05rem] p-0 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 md:px-6">
              <p className="text-sm font-semibold">최근 작업</p>
              <Button variant="link" className="h-auto p-0 text-xs font-semibold" asChild>
                <Link href="/reports">전체 리포트</Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="h-11 pl-6 text-xs font-semibold">유형</TableHead>
                  <TableHead className="text-xs font-semibold">제목</TableHead>
                  <TableHead className="text-xs font-semibold">상태</TableHead>
                  <TableHead className="h-11 pr-6 text-right text-xs font-semibold">일자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((r) => (
                  <TableRow key={r.title} className="border-border/50">
                    <TableCell className="pl-6 text-sm">{r.type}</TableCell>
                    <TableCell className="max-w-[10rem] truncate text-sm font-medium sm:max-w-none">
                      <Link
                        href={`/reports/${r.reportId}`}
                        className="text-primary hover:underline"
                      >
                        {r.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline" className="font-normal">
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right text-sm tabular-nums">
                      {r.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="surface-card rounded-[1.05rem] px-6 py-7">
            <p className="text-sm font-semibold">추천 기능</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              저장된 맥락을 바탕으로 다음 행동을 제안합니다.
            </p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="rounded-xl border border-border/50 bg-muted/35 p-4">
                <p className="font-medium">초안 메타 길이 조정</p>
                <p className="text-muted-foreground mt-0.5 text-xs">“재택근무 가이드” 초안</p>
                <Button size="sm" className="mt-3 w-full rounded-full font-medium" variant="secondary" asChild>
                  <Link href="/content/new">열기</Link>
                </Button>
              </li>
              <li className="rounded-xl border border-border/50 bg-muted/35 p-4">
                <p className="font-medium">키워드 확장 검토</p>
                <p className="text-muted-foreground mt-0.5 text-xs">연관 질문 5개 추가됨</p>
                <Button size="sm" className="mt-3 w-full rounded-full font-medium" variant="secondary" asChild>
                  <Link href="/analyze/keyword">분석</Link>
                </Button>
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </>
  )
}
