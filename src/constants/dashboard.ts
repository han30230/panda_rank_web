/**
 * 대시보드 빠른 실행 — KPI·최근 작업은 `lib/dashboard-summary` + DB 기준
 */

export type KpiTrend = "up" | "down" | "flat"

export type QuickAction = {
  id: string
  href: string
  label: string
  description: string
  primary?: boolean
}

export const quickActions: QuickAction[] = [
  {
    id: "kw",
    href: "/analyze/keyword",
    label: "새 키워드 분석",
    description: "의도·연관어·제목 각도",
    primary: true,
  },
  {
    id: "content",
    href: "/content/new",
    label: "새 글 생성",
    description: "톤·길이·점수 피드백",
  },
  {
    id: "compare",
    href: "/compare",
    label: "URL·글 비교",
    description: "두 본문 겹침·유사도",
  },
  {
    id: "extract",
    href: "/analyze/keyword?mode=extract",
    label: "키워드 추출",
    description: "본문 붙여넣기",
  },
]
