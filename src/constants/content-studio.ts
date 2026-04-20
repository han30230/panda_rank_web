/** 글 유형 — 선택 시 기본 톤 프리셋과 연동 */
export const CONTENT_POST_TYPES = [
  { id: "informative", label: "정보성 글", tonePresetId: "info-calm" },
  { id: "review", label: "리뷰·비교", tonePresetId: "review" },
  { id: "story", label: "스토리·후기", tonePresetId: "story" },
  { id: "tutorial", label: "튜토리얼·가이드", tonePresetId: "tutorial" },
  { id: "marketing", label: "홍보·랜딩", tonePresetId: "marketing" },
  { id: "opinion", label: "칼럼·의견", tonePresetId: "opinion" },
  { id: "casual", label: "일상·캐주얼", tonePresetId: "casual" },
] as const

/** 우측 패널 — 실시간 트렌드 예시 (분석 페이지로 연결) */
export const CONTENT_TRENDING_TOPICS: {
  id: string
  title: string
  query: string
  hot?: boolean
}[] = [
  { id: "t1", title: "겨울 캠핑 장비 체크리스트", query: "겨울 캠핑 장비", hot: true },
  { id: "t2", title: "재택근무 집중 루틴 정리", query: "재택근무 집중", hot: true },
  { id: "t3", title: "미니멀 책상 정리 Before/After", query: "미니멀 책상 정리" },
  { id: "t4", title: "로컬 맛집 후기 쓰는 법", query: "맛집 후기 블로그" },
  { id: "t5", title: "연말 선물 세트 비교", query: "연말 선물 세트" },
  { id: "t6", title: "쿠팡 파트너스 글 구조", query: "쿠팡 파트너스" },
]

/** 콘텐츠 작성 — 톤 프리셋 (API에 그대로 전달) */
export const CONTENT_TONE_PRESETS = [
  { id: "info-calm", label: "정보형 · 차분", value: "정보형 · 차분" },
  { id: "info-friendly", label: "정보형 · 친근", value: "정보형 · 친근한 설명체" },
  { id: "story", label: "스토리텔링 · 감성", value: "스토리텔링 · 감성적인 톤" },
  { id: "expert", label: "전문가 · 격식", value: "전문가 시점 · 격식 있는 설명" },
  { id: "review", label: "리뷰·비교", value: "리뷰·비교형 · 솔직한 톤" },
  { id: "marketing", label: "마케팅 · CTA", value: "마케팅 · 행동 유도(CTA) 강조" },
  { id: "casual", label: "대화체 · 캐주얼", value: "대화체 · 캐주얼하고 가벼운 톤" },
  { id: "opinion", label: "의견·칼럼", value: "의견·칼럼형 · 필자의 관점 강조" },
  { id: "tutorial", label: "튜토리얼 · 단계별", value: "튜토리얼 · 단계별 따라 하기" },
] as const

export const CONTENT_LENGTH_OPTIONS: {
  id: "draft" | "full"
  label: string
  description: string
}[] = [
  {
    id: "draft",
    label: "초안",
    description: "구조·핵심만 빠르게 (짧은 분량)",
  },
  {
    id: "full",
    label: "전체 글",
    description: "섹션을 풍부하게 완성형 (긴 분량)",
  },
]
