/**
 * SaaS UI 토큰 (문서화용). 실제 값은 `globals.css` :root 와 동기화합니다.
 * @see src/app/globals.css
 */
export const designTokens = {
  /** 섹션 상하 여백 — 시선 리셋 · 프리미엄 ‘숨 구멍’ */
  sectionY: "var(--section-py)",
  sectionYTight: "var(--section-py-tight)",
  /** 페이지 가로 안전 영역 — `marketing-container` 와 동일 */
  gutter: "max-w-7xl px-4 md:px-6 lg:px-8 mx-auto",
  /** 본문 가독 폭 */
  proseNarrow: "max-w-2xl",
  proseWide: "max-w-3xl",
  /** 표면: 카드=전경, muted=구역 구분 */
  surface: {
    page: "bg-background",
    muted: "bg-muted/35 border-y border-border/45",
    card: "bg-card border border-border/80 shadow-sm",
  },
  /** 위계: eyebrow < title < lead < body < caption */
  typeRoles: ["eyebrow", "display", "title", "lead", "body", "caption"] as const,
} as const
