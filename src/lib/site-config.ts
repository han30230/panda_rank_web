export const siteConfig = {
  name: "RankDeck",
  nameKo: "랭크덱",
  description:
    "키워드 인사이트, AI 초안, 온페이지 점검을 한 흐름으로. 데이터로 콘텐츠 의사결정을 단순화합니다.",
  url: "https://rankdeck.example.com",
  links: {
    docs: "/pricing",
    support: "mailto:support@example.com",
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
] as const
