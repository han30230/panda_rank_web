import type { Metadata } from "next"
import Link from "next/link"

import { BehaviorFlowSection } from "@/components/landing/behavior-flow-section"
import { CtaBanner } from "@/components/landing/cta-banner"
import { DashboardPreviewSection } from "@/components/landing/dashboard-preview-section"
import { LandingMidCta } from "@/components/landing/landing-mid-cta"
import { ProductTourSection } from "@/components/landing/product-tour-section"
import { SocialProofStrip } from "@/components/landing/social-proof-strip"
import { TrustStatsSection } from "@/components/landing/trust-stats-section"
import { WorkflowSection } from "@/components/landing/workflow-section"
import { PublicPageShell } from "@/components/layout/public-page-shell"
import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Faq } from "@/components/sections/faq"
import { Features } from "@/components/sections/features"
import { Hero } from "@/components/sections/hero"
import { PricingSection } from "@/components/sections/pricing"
import { UseCases } from "@/components/sections/use-cases"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WebsiteJsonLd } from "@/components/seo/json-ld"
import { siteConfig, siteUrl } from "@/lib/site-config"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — 키워드·콘텐츠 자동화`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["SEO", "키워드 분석", "콘텐츠 자동화", "AI 작성", "온페이지", "SaaS"],
  openGraph: {
    title: `${siteConfig.name} — 키워드·콘텐츠 자동화`,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — 키워드·콘텐츠 자동화`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  return (
    <PublicPageShell>
      <WebsiteJsonLd />
      <Hero />
      <SocialProofStrip />
      <BehaviorFlowSection />
      <WorkflowSection />
      <Features />
      <LandingMidCta
        heading="내 사이트에 맞는 워크플로를 골라 보세요"
        description="온보딩에서 목표만 고르면 대시보드 추천과 메뉴 순서가 정돈됩니다."
        primary={{ label: "무료로 시작", href: "/dashboard" }}
        secondary={{ label: "플랜·한도 비교", href: "/pricing" }}
      />
      <UseCases />
      <ProductTourSection />
      <TrustStatsSection />
      <MarketingSection variant="band">
        <SectionHeader
          title="팀이 느낀 변화"
          description="검증된 수치가 아니라, 도입 전후의 흐름 변화에 집중한 인용입니다."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {[
            {
              quote: "기획 회의 전에 리포트가 먼저 올라와서 합의가 빨라졌습니다.",
              role: "콘텐츠 리드 · SaaS",
            },
            {
              quote: "버전 비교가 있어 클라이언트 피드백을 구조적으로 받습니다.",
              role: "에이전시 PM",
            },
            {
              quote: "상품 설명 초안 속도가 체감으로 확 줄었습니다.",
              role: "이커머스 운영",
            },
          ].map((t) => (
            <Card key={t.role} className="surface-card p-7 md:p-8">
              <p className="text-[15px] font-medium leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-muted-foreground mt-6 text-xs font-medium tracking-wide">{t.role}</p>
            </Card>
          ))}
        </div>
      </MarketingSection>
      <LandingMidCta
        heading="대시보드에서 다음 작업이 보입니다"
        description="자주 쓰는 분석·작성을 상단에 두고, KPI와 최근 작업으로 상태를 유지합니다."
        primary={{ label: "앱 둘러보기", href: "/dashboard" }}
        secondary={{ label: "요금 안내", href: "/pricing" }}
      />
      <DashboardPreviewSection />
      <PricingSection />
      <MarketingSection spacing="tight">
        <div className="surface-card flex flex-col items-start justify-between gap-6 rounded-[1.25rem] border-border/70 px-8 py-10 md:flex-row md:items-center md:px-12 md:py-12">
          <div className="text-center md:text-left">
            <h2 className="text-title-sm">요금은 투명하게</h2>
            <p className="text-lead mt-3 max-w-lg">
              무료 한도·팀 시트·연간 할인을 한 표에서 비교합니다. 신용카드 없이 무료 체험을 시작할 수 있습니다.
            </p>
          </div>
          <Button size="lg" className="h-12 shrink-0 rounded-full px-10 font-semibold" asChild>
            <Link href="/pricing">요금제 전체 보기</Link>
          </Button>
        </div>
      </MarketingSection>
      <Faq />
      <CtaBanner />
    </PublicPageShell>
  )
}
