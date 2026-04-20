/**
 * 대시보드 목업 — GET /api/dashboard/summary 형태로 매핑하기 쉽게 객체로 유지
 */

export type KpiTrend = "up" | "down" | "flat"

export const dashboardKpis = [
  {
    id: "weekly-analysis",
    label: "이번 주 분석",
    value: "18",
    hint: "목표 대비 92%",
    trend: "up" as KpiTrend,
    delta: "지난주 대비 +3",
  },
  {
    id: "avg-seo",
    label: "평균 SEO 점수",
    value: "76",
    hint: "가이드 기준",
    trend: "up" as KpiTrend,
    delta: "+4 pts",
  },
  {
    id: "drafts",
    label: "저장된 초안",
    value: "6",
    hint: "2건 피드백 대기",
    trend: "flat" as KpiTrend,
    delta: "변동 없음",
  },
  {
    id: "credits",
    label: "크레딧",
    value: "3,420",
    hint: "프로 플랜",
    trend: "down" as KpiTrend,
    delta: "−180 이번 달",
  },
] as const

export type ProjectRow = {
  id: string
  type: "분석" | "초안"
  title: string
  status: string
  date: string
  href: string
}

export const recentProjects: ProjectRow[] = [
  {
    id: "r1",
    type: "분석",
    title: "캠핑용 버너 추천",
    status: "실행중",
    date: "4월 18일",
    href: "/reports/r_kw_91bc",
  },
  {
    id: "r2",
    type: "초안",
    title: "재택근무 생산성 가이드",
    status: "검토",
    date: "4월 17일",
    href: "/reports/r_ct_draft_2",
  },
  {
    id: "r3",
    type: "분석",
    title: "미니멀 책상 정리",
    status: "완료",
    date: "4월 16일",
    href: "/reports/r_kw_7f3a",
  },
]

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
    href: "/workspace/new",
    label: "URL·글 비교",
    description: "새 작업에서 선택",
  },
  {
    id: "extract",
    href: "/analyze/keyword",
    label: "키워드 추출",
    description: "본문 붙여넣기",
  },
]

export type AiRecommendation = {
  id: string
  title: string
  description: string
  actionLabel: string
  href: string
}

export const aiRecommendations: AiRecommendation[] = [
  {
    id: "a1",
    title: "초안 메타 길이 조정",
    description: "“재택근무 가이드” 초안",
    actionLabel: "열기",
    href: "/content/new",
  },
  {
    id: "a2",
    title: "키워드 확장 검토",
    description: "연관 질문 5개 추가됨",
    actionLabel: "분석",
    href: "/analyze/keyword",
  },
]
