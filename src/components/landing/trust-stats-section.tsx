import { MarketingSection } from "@/components/layout/marketing-section"
import { Card } from "@/components/ui/card"

const stats = [
  { label: "누적 분석 요청", value: "120만+", hint: "최근 12개월 기준" },
  { label: "평균 응답 시간", value: "~2.1초", hint: "표준 워크플로" },
  { label: "만족도 응답", value: "4.6/5", hint: "내부 NPS 설문" },
]

export function TrustStatsSection() {
  return (
    <MarketingSection spacing="tight">
      <p className="text-eyebrow text-center">신뢰 지표</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="surface-card px-8 py-9 text-center"
          >
            <p className="text-caption font-medium">{s.label}</p>
            <p className="text-primary mt-3 text-3xl font-semibold tabular-nums tracking-tight md:text-4xl">
              {s.value}
            </p>
            <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">{s.hint}</p>
          </Card>
        ))}
      </div>
      <p className="text-caption mt-8 text-center">
        운영 환경에서는 실제 지표·대시보드 데이터로 교체할 수 있습니다.
      </p>
    </MarketingSection>
  )
}
