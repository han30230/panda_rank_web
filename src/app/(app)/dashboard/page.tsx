import Link from "next/link"
import { Plus } from "lucide-react"

import { AppHeader } from "@/components/app/app-header"
import { AiRecommendations } from "@/components/dashboard/ai-recommendations"
import { DashboardActivityChart } from "@/components/dashboard/dashboard-activity-chart"
import { DashboardWelcomeBanner } from "@/components/dashboard/dashboard-welcome-banner"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
          <QuickActions />
        </section>

        <section aria-label="요약 지표">
          <KpiCards />
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
          <div className="lg:col-span-2">
            <RecentProjects />
          </div>
          <AiRecommendations />
        </section>
      </div>
    </>
  )
}
