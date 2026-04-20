import { prisma } from "@/lib/prisma"

import type { KpiTrend } from "@/constants/dashboard"

export type DashboardKpi = {
  id: string
  label: string
  value: string
  hint: string
  trend: KpiTrend
  delta: string
}

export type ActivityWeek = { label: string; v: number }

export type RecentProjectRow = {
  id: string
  type: "분석" | "초안"
  title: string
  status: string
  date: string
  href: string
}

export type AiRec = {
  id: string
  title: string
  description: string
  actionLabel: string
  href: string
}

export type DashboardSummary = {
  kpis: DashboardKpi[]
  recentProjects: RecentProjectRow[]
  activityWeeks: ActivityWeek[]
  creditUsagePercent: number
  creditRemaining: number
  creditHint: string
  aiRecommendations: AiRec[]
  hasSession: boolean
}

function startOfWeekMonday(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

function formatKoDate(d: Date): string {
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" }).format(d)
}

export function emptyDashboardSummary(): DashboardSummary {
  const currentMonday = startOfWeekMonday(new Date())
  const emptyWeeks: ActivityWeek[] = Array.from({ length: 4 }, (_, i) => {
    const ws = new Date(currentMonday)
    ws.setDate(ws.getDate() - (3 - i) * 7)
    return { label: `${ws.getMonth() + 1}/${ws.getDate()}`, v: 0 }
  })

  return {
    hasSession: false,
    kpis: [
      {
        id: "weekly-analysis",
        label: "이번 주 작업",
        value: "0",
        hint: "로그인 후 리포트가 집계됩니다",
        trend: "flat",
        delta: "—",
      },
      {
        id: "avg-seo",
        label: "평균 SEO 점수",
        value: "—",
        hint: "리포트 저장 시 점수가 기록됩니다",
        trend: "flat",
        delta: "—",
      },
      {
        id: "drafts",
        label: "저장된 초안",
        value: "0",
        hint: "콘텐츠 작성에서 저장한 건",
        trend: "flat",
        delta: "—",
      },
      {
        id: "credits",
        label: "남은 크레딧",
        value: "—",
        hint: "이번 달 사용량 기준",
        trend: "flat",
        delta: "—",
      },
    ],
    recentProjects: [],
    activityWeeks: emptyWeeks,
    creditUsagePercent: 0,
    creditRemaining: 0,
    creditHint: "로그인하면 사용량이 표시됩니다.",
    aiRecommendations: [
      {
        id: "login",
        title: "키워드 분석부터 시작",
        description: "로그인 후 리포트가 대시보드에 쌓입니다.",
        actionLabel: "분석",
        href: "/analyze/keyword",
      },
      {
        id: "content",
        title: "콘텐츠 초안 작성",
        description: "주제와 키워드를 넣으면 초안과 점수를 받습니다.",
        actionLabel: "작성",
        href: "/content/new",
      },
    ],
  }
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeekAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const creditCap = Number(process.env.MONTHLY_CREDIT_CAP ?? 5000)
  const creditPerReport = Number(process.env.CREDITS_PER_REPORT ?? 80)

  const [
    reportsWeek,
    reportsPrevWeek,
    reportsMonth,
    scored,
    contentDrafts,
    recentReports,
    reviewContent,
    lastAnalyze,
  ] = await Promise.all([
    prisma.report.count({ where: { userId, updatedAt: { gte: weekAgo } } }),
    prisma.report.count({ where: { userId, updatedAt: { gte: twoWeekAgo, lt: weekAgo } } }),
    prisma.report.count({ where: { userId, createdAt: { gte: monthStart } } }),
    prisma.report.findMany({
      where: { userId, seoScore: { not: null } },
      select: { seoScore: true },
    }),
    prisma.report.count({ where: { userId, kind: "content" } }),
    prisma.report.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, kind: true, status: true, updatedAt: true },
    }),
    prisma.report.findFirst({
      where: { userId, kind: "content", status: "검토" },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true },
    }),
    prisma.report.findFirst({
      where: { userId, kind: "analyze" },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, keyword: true },
    }),
  ])

  const avgSeo =
    scored.length > 0
      ? Math.round(
          scored.reduce((a, r) => a + (r.seoScore ?? 0), 0) / scored.length,
        )
      : null

  const weeklyDelta = reportsWeek - reportsPrevWeek
  const weeklyTrend: KpiTrend =
    weeklyDelta > 0 ? "up" : weeklyDelta < 0 ? "down" : "flat"
  const weeklyDeltaStr =
    weeklyDelta === 0
      ? "지난주와 동일"
      : weeklyDelta > 0
        ? `지난주 대비 +${weeklyDelta}`
        : `지난주 대비 ${weeklyDelta}`

  const usedCredits = Math.min(reportsMonth * creditPerReport, creditCap)
  const creditUsagePercent = Math.round((usedCredits / creditCap) * 100)
  const remaining = Math.max(0, creditCap - usedCredits)
  const fmt = new Intl.NumberFormat("ko-KR")
  const creditTrend: KpiTrend =
    creditUsagePercent >= 85 ? "down" : creditUsagePercent <= 40 ? "up" : "flat"
  const creditDelta =
    creditUsagePercent >= 85
      ? "한도에 가까움"
      : creditUsagePercent <= 40
        ? "여유 있음"
        : "이번 달 기준"

  const currentMonday = startOfWeekMonday(new Date(now))
  const weekRanges = Array.from({ length: 4 }, (_, i) => {
    const ws = new Date(currentMonday)
    ws.setDate(ws.getDate() - (3 - i) * 7)
    const we = new Date(ws)
    we.setDate(we.getDate() + 7)
    return {
      ws,
      we,
      label: `${ws.getMonth() + 1}/${ws.getDate()}`,
    }
  })
  const weekCounts = await Promise.all(
    weekRanges.map(({ ws, we }) =>
      prisma.report.count({ where: { userId, createdAt: { gte: ws, lt: we } } }),
    ),
  )
  const activityWeeks: ActivityWeek[] = weekRanges.map((w, i) => ({
    label: w.label,
    v: weekCounts[i] ?? 0,
  }))

  const recentProjects: RecentProjectRow[] = recentReports.map((r) => ({
    id: r.id,
    type: r.kind === "content" ? "초안" : "분석",
    title: r.title,
    status: r.status,
    date: formatKoDate(r.updatedAt),
    href: `/reports/${r.id}`,
  }))

  const aiRecommendations: AiRec[] = []
  if (reviewContent) {
    const short = reviewContent.title.length > 42 ? `${reviewContent.title.slice(0, 42)}…` : reviewContent.title
    aiRecommendations.push({
      id: `rec-review-${reviewContent.id}`,
      title: "초안 메타·본문 점검",
      description: `“${short}” 초안이 검토 대기 중입니다.`,
      actionLabel: "열기",
      href: `/reports/${reviewContent.id}`,
    })
  }
  if (lastAnalyze) {
    const label = lastAnalyze.keyword?.trim() || lastAnalyze.title
    aiRecommendations.push({
      id: `rec-kw-${lastAnalyze.id}`,
      title: "키워드 확장 검토",
      description: `최근 분석: ${label}`,
      actionLabel: "이어서 분석",
      href: "/analyze/keyword",
    })
  }
  const filler: AiRec[] = [
    {
      id: "rec-new-kw",
      title: "새 키워드 분석",
      description: "의도·연관어·제목 각도를 먼저 잡습니다.",
      actionLabel: "시작",
      href: "/analyze/keyword",
    },
    {
      id: "rec-new-content",
      title: "새 글 생성",
      description: "톤·길이·점수 피드백",
      actionLabel: "작성",
      href: "/content/new",
    },
  ]
  for (const f of filler) {
    if (aiRecommendations.length >= 2) break
    aiRecommendations.push(f)
  }

  const kpis: DashboardKpi[] = [
    {
      id: "weekly-analysis",
      label: "이번 주 작업",
      value: String(reportsWeek),
      hint: "최근 7일 이내 생성·수정된 리포트",
      trend: weeklyTrend,
      delta: weeklyDeltaStr,
    },
    {
      id: "avg-seo",
      label: "평균 SEO 점수",
      value: avgSeo != null ? String(avgSeo) : "—",
      hint: avgSeo != null ? "저장된 리포트의 점수 평균" : "리포트 저장 시 점수가 기록됩니다",
      trend: "flat",
      delta: avgSeo != null ? "저장된 리포트 기준" : "신규 저장 시 반영",
    },
    {
      id: "drafts",
      label: "저장된 초안",
      value: String(contentDrafts),
      hint: "콘텐츠 작성에서 저장한 건",
      trend: contentDrafts > 0 ? "up" : "flat",
      delta: contentDrafts > 0 ? "초안 탭에서 이어서 편집" : "아직 없음",
    },
    {
      id: "credits",
      label: "남은 크레딧",
      value: fmt.format(remaining),
      hint: `프로 플랜 · 월 한도 ${fmt.format(creditCap)}`,
      trend: creditTrend,
      delta: creditDelta,
    },
  ]

  return {
    hasSession: true,
    kpis,
    recentProjects,
    activityWeeks,
    creditUsagePercent,
    creditRemaining: remaining,
    creditHint: `${creditUsagePercent}% 사용 · 이번 달 ${reportsMonth}건 리포트 생성`,
    aiRecommendations: aiRecommendations.slice(0, 2),
  }
}
