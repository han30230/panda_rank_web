import type { Metadata } from "next"

import { PandaPromoTicker } from "@/components/chat/panda-promo-ticker"
import { ContentStudioPanel } from "@/components/content/content-studio-panel"
import { PANDA_BG_SOFT } from "@/lib/pandarank-theme"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `인플루언서 포스트 | ${siteConfig.name}`,
  description:
    "판다랭크형 AI 블로그 글쓰기. 키워드·톤·분량 맞춤 초안, 네이버 검색 구조에 맞춘 본문·메타.",
}

export default function InfluencerPostToolPage() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ backgroundColor: PANDA_BG_SOFT }}
    >
      <PandaPromoTicker />
      <div className="app-content-shell flex-1 pb-10">
        <ContentStudioPanel variant="pandarank" />
      </div>
    </div>
  )
}
