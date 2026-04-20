import type { Metadata } from "next"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "이용약관",
  description: `${siteConfig.name} 서비스 이용약관입니다.`,
}

export default function TermsPage() {
  return (
    <div className="marketing-container py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground text-sm font-medium">법무</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">이용약관</h1>
        <p className="text-muted-foreground mt-2 text-sm">시행일: {new Date().getFullYear()}년 4월 20일</p>
        <Card className="surface-card mt-10 space-y-6 rounded-3xl p-8 text-sm leading-relaxed md:p-10">
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">1. 목적</h2>
            <p className="text-muted-foreground">
              본 약관은 {siteConfig.name}({siteConfig.nameKo})가 제공하는 온라인 서비스의 이용 조건 및 절차,
              권리·의무 및 책임 사항을 규정합니다. 서비스를 이용함으로써 이용자는 본 약관에 동의한 것으로
              간주됩니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">2. 서비스의 제공</h2>
            <p className="text-muted-foreground">
              회사는 키워드 분석, 콘텐츠 초안 지원 등 제품 화면에 안내된 기능을 제공합니다. 서비스 일부는
              베타·데모로 제공될 수 있으며, 기능·가격·한도는 공지 또는 약관 개정을 통해 변경될 수 있습니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">3. 계정 및 의무</h2>
            <p className="text-muted-foreground">
              이용자는 정확한 정보를 제공하고 계정 보안에 유의해야 합니다. 타인의 권리를 침해하거나
              불법·유해한 목적으로 서비스를 이용해서는 안 됩니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">4. 유료 서비스</h2>
            <p className="text-muted-foreground">
              유료 플랜은 요금제 페이지에 따라 청구됩니다. 청구 주기·해지·환불 조건은 결제 시 안내되는 정책을
              따릅니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">5. 면책</h2>
            <p className="text-muted-foreground">
              서비스는 &ldquo;있는 그대로&rdquo; 제공됩니다. 검색 순위·매출 등 결과를 보장하지 않으며,
              불가항력·제3자 서비스 장애로 인한 손해에 대해 법령이 허용하는 한도 내에서 책임을 제한합니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">6. 문의</h2>
            <p className="text-muted-foreground">
              약관 관련 문의는{" "}
              <a href={siteConfig.links.support} className="text-primary font-medium underline underline-offset-4">
                고객 지원
              </a>
              으로 연락해 주세요.
            </p>
          </section>
        </Card>
        <p className="text-muted-foreground mt-8 text-center text-xs">
          <Link href="/" className="underline-offset-4 hover:underline">
            홈으로
          </Link>
        </p>
      </div>
    </div>
  )
}
