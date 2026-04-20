/** 요금 페이지·섹션 공용 — API 연동 시 플랜 ID로 매핑 */

export type PricingPlan = {
  id: string
  name: string
  description: string
  price: string
  priceSuffix: string
  featured?: boolean
  features: readonly string[]
  cta: { label: string; href: string }
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "스타터",
    description: "개인·초기 검증",
    price: "₩0",
    priceSuffix: "/월",
    features: ["월 분석 20회", "생성 크레딧 월 300", "1인", "이메일 지원"],
    cta: { label: "무료로 시작", href: "/dashboard" },
  },
  {
    id: "pro",
    name: "프로",
    description: "성장하는 콘텐츠 팀",
    price: "₩49,000",
    priceSuffix: "/월",
    featured: true,
    features: [
      "분석 공정 사용(공정정책 적용)",
      "생성 크레딧 월 5,000",
      "팀원 5명",
      "우선 지원",
    ],
    cta: { label: "7일 무료 체험", href: "/dashboard" },
  },
  {
    id: "team",
    name: "팀·기업",
    description: "에이전시·엔터프라이즈",
    price: "별도 협의",
    priceSuffix: "",
    features: ["SSO", "감사 로그", "API·웹훅", "전담 CSM", "맞춤 SLA"],
    cta: { label: "영업 문의", href: "mailto:sales@example.com" },
  },
]
