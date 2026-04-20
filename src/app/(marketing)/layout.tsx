import type { Metadata } from "next"

import { PublicPageShell } from "@/components/layout/public-page-shell"
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

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PublicPageShell>{children}</PublicPageShell>
}
