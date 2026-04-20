"use client"

import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { useCasesByRole, type UseCaseRole } from "@/constants/landing"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const roles: { value: UseCaseRole; label: string }[] = [
  { value: "marketer", label: "마케터" },
  { value: "creator", label: "크리에이터" },
  { value: "operator", label: "운영" },
]

export function UseCases() {
  return (
    <MarketingSection id="cases" variant="muted">
      <SectionHeader
        eyebrow="팀 시나리오"
        title="역할별로 바로 쓰는 흐름"
        description="탭을 바꿔도 패턴은 동일합니다. 같은 화면에서 학습 비용을 줄였습니다."
      />
      <Tabs defaultValue="marketer" className="mt-12">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3 rounded-xl border border-border/60 bg-muted/50 p-1 shadow-sm">
          {roles.map((r) => (
            <TabsTrigger key={r.value} value={r.value} className="rounded-lg text-xs sm:text-sm">
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {roles.map((r) => {
          const c = useCasesByRole[r.value]
          return (
            <TabsContent key={r.value} value={r.value} className="mt-10">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
                <Card className="surface-card rounded-[1.25rem] p-8 md:p-9">
                  <p className="text-primary text-sm font-semibold">{c.title}</p>
                  <p className="mt-4 text-lg font-medium leading-relaxed tracking-tight">{c.summary}</p>
                  <ul className="text-muted-foreground mt-8 space-y-2.5 text-sm leading-relaxed">
                    {c.bullets.map((b) => (
                      <li key={b}>· {b}</li>
                    ))}
                  </ul>
                </Card>
                <Card className="surface-card flex flex-col justify-between rounded-[1.25rem] p-8 md:p-9">
                  <p className="text-sm font-semibold">정량 스냅샷 (예시)</p>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    {c.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-border/60 bg-muted/40 p-5"
                      >
                        <p className="text-muted-foreground text-xs font-medium">{m.label}</p>
                        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
                          {m.value}
                        </p>
                        <p className="text-muted-foreground mt-1.5 text-xs">{m.hint}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </MarketingSection>
  )
}
