/**
 * 랜딩 페이지용 목업 데이터.
 * 추후 API 연동 시 같은 형태의 fetch 결과로 교체하면 됩니다.
 */

export const heroContent = {
  eyebrow: "SEO · AI 콘텐츠 · 운영 워크스페이스",
  titleLines: ["네이버형 콘텐츠에 맞춘", "키워드·SEO·초안 워크스페이스"] as const,
  description:
    "검색 의도부터 초안까지 한 흐름으로 묶었습니다. 처음이어도 단계가 보이도록 안내합니다.",
  primaryCta: { label: "7일 무료로 시작", href: "/signup" },
  secondaryCta: { label: "플랜 비교", href: "/pricing" },
  sampleKeywords: ["연말 선물 세트", "로컬 맛집 후기", "재택 근무 생산성"] as const,
  preview: {
    fitScore: 78,
    titleSuggestions: [
      "캠핑 버너 고르기 전에 볼 체크리스트",
      "입문자용 캠핑 버너 비교 가이드",
      "2026 추천 캠핑 버너 5선",
    ],
    checklistProgress: { done: 5, total: 8 },
  },
} as const

/** 히어로 검색 카드 하단 샘플 순위 행 (목업) */
export const heroSampleRank = {
  rank: 1,
  keyword: "살목지",
} as const

export type HeroQuickToolBadge = "new" | "ai"

export type HeroQuickToolItem = {
  id: string
  label: string
  href: string
  /** lucide 아이콘 키 — HeroQuickTools에서 매핑 */
  icon:
    | "fileBarChart"
    | "penLine"
    | "image"
    | "shoppingBag"
    | "barChart3"
    | "gift"
    | "trophy"
    | "shoppingCart"
  /** Tailwind: 아이콘 원 배경/테두리/글자색 */
  colorClass: string
  badge?: HeroQuickToolBadge
}

/** 레퍼런스와 유사한 8개 바로가기 (블로그·쇼핑 등) */
export const heroQuickTools: HeroQuickToolItem[] = [
  {
    id: "blog-analysis",
    label: "블로그 분석",
    href: "/analyze/keyword",
    icon: "fileBarChart",
    colorClass: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20",
  },
  {
    id: "blog-write",
    label: "블로그글쓰기",
    href: "/content/new",
    icon: "penLine",
    colorClass: "bg-sky-500/15 text-sky-700 ring-sky-500/20",
    badge: "ai",
  },
  {
    id: "ai-image",
    label: "AI 이미지",
    href: "/signup?intent=ai-image",
    icon: "image",
    colorClass: "bg-violet-500/15 text-violet-700 ring-violet-500/20",
    badge: "new",
  },
  {
    id: "shopping-connect",
    label: "쇼핑커넥트",
    href: "/signup?intent=shopping-connect",
    icon: "shoppingBag",
    colorClass: "bg-emerald-600/15 text-emerald-800 ring-emerald-600/25",
    badge: "new",
  },
  {
    id: "blog-rank",
    label: "블로그순위",
    href: "/signup?intent=blog-rank",
    icon: "barChart3",
    colorClass: "bg-orange-500/15 text-orange-700 ring-orange-500/20",
  },
  {
    id: "product-review",
    label: "제품체험단",
    href: "/signup?intent=review",
    icon: "gift",
    colorClass: "bg-pink-500/15 text-pink-700 ring-pink-500/20",
  },
  {
    id: "product-rank",
    label: "상품순위",
    href: "/signup?intent=product-rank",
    icon: "trophy",
    colorClass: "bg-amber-500/15 text-amber-800 ring-amber-500/25",
  },
  {
    id: "product-analysis",
    label: "상품분석",
    href: "/signup?intent=product-analysis",
    icon: "shoppingCart",
    colorClass: "bg-red-500/15 text-red-700 ring-red-500/20",
  },
]

export const heroPromo = {
  badge: "판다 실험실",
  title: "돈 되는 황금 키워드",
  titleAccent: "TOP 100",
  carouselHint: "1 / 8",
  /** `public/images/` — PNG로 교체 시 같은 경로명 유지 가능 */
  imageSrc: "/images/golden-apple.svg",
  imageAlt: "황금 키워드 골든 애플",
} as const

export type FeatureItem = {
  id: string
  icon: "sparkles" | "bot" | "percent" | "compare" | "cpu" | "bookmark"
  title: string
  description: string
}

export const featureItems: FeatureItem[] = [
  {
    id: "autocomplete",
    icon: "sparkles",
    title: "자동완성",
    description: "키워드·질문형 쿼리를 입력 중에 제안합니다.",
  },
  {
    id: "ai",
    icon: "bot",
    title: "AI 추천",
    description: "제목·목차·메타를 후보로 띄우고 고릅니다.",
  },
  {
    id: "score",
    icon: "percent",
    title: "점수화",
    description: "SEO·가독성·키워드 적합도를 숫자로 압축합니다.",
  },
  {
    id: "compare",
    icon: "compare",
    title: "비교",
    description: "상위 글·자사 글을 구조 단위로 맞춥니다.",
  },
  {
    id: "extract",
    icon: "cpu",
    title: "추출",
    description: "URL·본문에서 엔티티와 헤딩을 뽑습니다.",
  },
  {
    id: "save",
    icon: "bookmark",
    title: "저장",
    description: "프로젝트·버전 단위로 리포트를 보관합니다.",
  },
]

export type UseCaseRole = "marketer" | "creator" | "operator"

export type UseCaseContent = {
  title: string
  summary: string
  bullets: readonly string[]
  metrics: readonly { label: string; value: string; hint: string }[]
}

export const useCasesByRole: Record<UseCaseRole, UseCaseContent> = {
  marketer: {
    title: "콘텐츠 마케터",
    summary: "캠페인마다 키워드 맵을 빠르게 만들고, 초안 리뷰 라운드를 줄입니다.",
    bullets: [
      "추천 액션 카드로 다음 작업이 정해집니다.",
      "리포트는 프로젝트 단위로 보관됩니다.",
      "초안 버전은 비교 후 하나로 합칩니다.",
    ],
    metrics: [
      { label: "기획 시간", value: "−38%", hint: "내부 베타 평균" },
      { label: "재작성 라운드", value: "−2회", hint: "팀 설문" },
    ],
  },
  creator: {
    title: "크리에이터",
    summary: "주제 후보를 데이터로 걸러 내고, 톤을 유지한 채 여러 버전을 뽑습니다.",
    bullets: [
      "제목 후보를 점수와 함께 비교합니다.",
      "톤·금지어를 팀 룰로 고정합니다.",
      "발행 직전 체크리스트로 누락을 줄입니다.",
    ],
    metrics: [
      { label: "발행 주기", value: "+21%", hint: "샘플 코호트" },
      { label: "검색 유입", value: "+12%", hint: "대표 사례" },
    ],
  },
  operator: {
    title: "오퍼레이터",
    summary: "상품·카테고리 URL을 기준으로 설명문과 FAQ 초안을 대량 준비합니다.",
    bullets: [
      "SKU별 메타·요약을 일괄 생성합니다.",
      "오류 리포트로 검수 포인트를 모읍니다.",
      "팀 플랜에서 공유 범위를 나눕니다.",
    ],
    metrics: [
      { label: "SKU당 시간", value: "−45%", hint: "파일럿" },
      { label: "오류 리포트", value: "−30%", hint: "QA 기준" },
    ],
  },
}

export const landingPricingTeasers = [
  {
    id: "free",
    name: "스타터",
    price: "₩0",
    period: "/월",
    description: "개인 크리에이터·검증용",
    highlights: ["월 분석 20회", "생성 크레딧 소량", "1인 워크스페이스"],
    cta: { label: "시작하기", href: "/signup" },
    featured: false,
  },
  {
    id: "pro",
    name: "프로",
    price: "₩49,000",
    period: "/월",
    description: "성장하는 팀에 맞춘 기본 플랜",
    highlights: ["월 분석 무제한(공정 사용)", "팀 초대 5명", "리포트 버전 관리"],
    cta: { label: "7일 체험", href: "/signup" },
    featured: true,
  },
  {
    id: "team",
    name: "팀",
    price: "별도 문의",
    period: "",
    description: "에이전시·in-house 콘텐츠 조직",
    highlights: ["SSO·감사 로그", "API·웹훅", "전담 온보딩"],
    cta: { label: "문의하기", href: "/pricing" },
    featured: false,
  },
] as const

export const socialProofStrip = {
  logos: ["Studio North", "Bloom Retail", "Atlas Media", "River Labs", "Pixel & Co"] as const,
  stats: [
    { label: "월간 분석 요청", value: "32만건" },
    { label: "평균 응답", value: "~2초" },
    { label: "업타임", value: "99.9%" },
  ],
} as const
