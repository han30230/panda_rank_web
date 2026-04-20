/** 배포 URL — Vercel·GitHub Pages 등에서 `NEXT_PUBLIC_SITE_URL` 로 덮어씁니다. */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? ""
export const siteUrl =
  rawSiteUrl.length > 0 ? rawSiteUrl : "https://rankdeck.example.com"

export const siteConfig = {
  name: "RankDeck",
  nameKo: "랭크덱",
  description:
    "키워드 인사이트, AI 초안, 온페이지 점검을 한 흐름으로. 데이터로 콘텐츠 의사결정을 단순화합니다.",
  url: siteUrl,
  links: {
    docs: "/pricing",
    support: "mailto:support@example.com",
    sales: "mailto:sales@example.com",
    privacy: "/privacy",
    terms: "/terms",
  },
} as const

export const mainNav = [
  {
    title: "제품",
    items: [
      { title: "작업 흐름", href: "/#workflow", description: "입력부터 저장까지" },
      { title: "핵심 기능", href: "/#capabilities", description: "자동완성·점수·비교 등" },
      { title: "이렇게 씁니다", href: "/#behavior", description: "실제 사용 행동" },
    ],
  },
  {
    title: "리소스",
    items: [
      { title: "요금제", href: "/pricing", description: "플랜·한도 비교" },
      { title: "고객 사례", href: "/#cases", description: "도입 스토리" },
      { title: "자주 묻는 질문", href: "/#faq", description: "저장·채널·결제" },
    ],
  },
  {
    title: "블로그",
    items: [
      { title: "블로그 글쓰기", href: "/content/new", description: "AI 초안·SEO 스튜디오" },
      { title: "블로그 분석", href: "/analyze/keyword", description: "키워드·검색 의도" },
      { title: "블로그 순위", href: "/reports", description: "저장 리포트·노출 점수" },
    ],
  },
  {
    title: "쿠팡 파트너스",
    items: [
      { title: "파트너스 글 쓰기", href: "/content/new", description: "리뷰·상세 초안" },
      { title: "상품 키워드 분석", href: "/analyze/keyword", description: "검색·경쟁 단어" },
      { title: "콘텐츠 리포트", href: "/reports", description: "성과·SEO 체크" },
    ],
  },
  {
    title: "트위터(X)",
    items: [
      { title: "스레드·짧은 글 초안", href: "/content/new", description: "훅 문장·쓰레드 구성" },
      { title: "트렌드 키워드", href: "/analyze/keyword", description: "주제 리서치" },
      { title: "워크스페이스", href: "/dashboard", description: "작업·캠페인" },
    ],
  },
  {
    title: "쇼핑커넥트",
    items: [
      { title: "쇼핑 대시보드", href: "/dashboard", description: "작업·연동 현황" },
      { title: "상품 키워드 분석", href: "/analyze/keyword", description: "검색·순위 리서치" },
      { title: "순위·리포트", href: "/reports", description: "성과 요약" },
    ],
  },
  {
    title: "티스토리",
    items: [
      { title: "티스토리 글 쓰기", href: "/content/new", description: "초안·메타 구성" },
      { title: "SEO 키워드 분석", href: "/analyze/keyword", description: "검색 의도" },
      { title: "글 리포트", href: "/reports", description: "체크리스트·점수" },
    ],
  },
  {
    title: "유튜브",
    items: [
      { title: "영상 스크립트 초안", href: "/content/new", description: "롤링·썸네일 문구" },
      { title: "주제·키워드 분석", href: "/analyze/keyword", description: "검색 트렌드" },
      { title: "콘텐츠 리포트", href: "/reports", description: "기획·성과 보관" },
    ],
  },
] as const
