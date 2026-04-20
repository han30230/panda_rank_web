import Link from "next/link"
import { Check } from "lucide-react"

import { landingPricingTeasers } from "@/constants/landing"
import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** 랜딩용 요금 요약 — 전체 비교는 /pricing */
export function PricingSection() {
  return (
    <MarketingSection>
      <SectionHeader
        eyebrow="요금"
        title="팀 단계에 맞는 플랜"
        description="한 장 요약입니다. 세부 한도·비교표는 요금 페이지에서 확인하세요."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {landingPricingTeasers.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "surface-card relative flex flex-col p-8",
              plan.featured && "border-primary/35 ring-1 ring-primary/20",
            )}
          >
            {plan.featured ? (
              <Badge className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3">
                인기
              </Badge>
            ) : null}
            <p className="text-sm font-semibold">{plan.name}</p>
            <p className="mt-1 flex items-baseline gap-0.5">
              <span className="text-3xl font-semibold tabular-nums tracking-tight">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </p>
            <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {plan.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <Button
              className={cn("mt-8 w-full rounded-full font-semibold", plan.featured && "shadow-md")}
              variant={plan.featured ? "default" : "outline"}
              asChild
            >
              <Link href={plan.cta.href}>{plan.cta.label}</Link>
            </Button>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button variant="ghost" size="sm" className="font-semibold" asChild>
          <Link href="/pricing">전체 플랜·한도 비교하기</Link>
        </Button>
      </div>
    </MarketingSection>
  )
}
