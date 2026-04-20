"use client"

import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const cases = {
  marketer: {
    title: "콘텐츠 마케터",
    summary: "캠페인마다 키워드 맵을 빠르게 만들고, 초안 리뷰 라운드를 줄입니다.",
    metrics: [
      { label: "기획 시간", value: "−38%", hint: "내부 베타 평균" },
      { label: "재작성 라운드", value: "−2회", hint: "팀 설문" },
    ],
  },
  creator: {
    title: "크리에이터",
    summary: "주제 후보를 데이터로 걸러 내고, 톤을 유지한 채 여러 버전을 뽑습니다.",
    metrics: [
      { label: "발행 주기", value: "+21%", hint: "샘플 코호트" },
      { label: "검색 유입", value: "+12%", hint: "대표 사례" },
    ],
  },
  operator: {
    title: "오퍼레이터",
    summary: "상품·카테고리 URL을 기준으로 설명문과 FAQ 초안을 대량 준비합니다.",
    metrics: [
      { label: "SKU당 시간", value: "−45%", hint: "파일럿" },
      { label: "오류 리포트", value: "−30%", hint: "QA 기준" },
    ],
  },
}

export function UseCasesSection() {
  return (
    <MarketingSection id="cases" variant="muted">
      <SectionHeader
        eyebrow="팀 시나리오"
        title="역할별로 바로 쓰는 흐름"
        description="탭을 바꿔도 패턴은 동일합니다. 같은 화면에서 학습 비용을 줄였습니다."
      />
      <Tabs defaultValue="marketer" className="mt-12">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3 rounded-xl border border-border/60 bg-muted/50 p-1 shadow-sm">
          <TabsTrigger value="marketer" className="rounded-lg text-xs sm:text-sm">
            마케터
          </TabsTrigger>
          <TabsTrigger value="creator" className="rounded-lg text-xs sm:text-sm">
            크리에이터
          </TabsTrigger>
          <TabsTrigger value="operator" className="rounded-lg text-xs sm:text-sm">
            운영
          </TabsTrigger>
        </TabsList>
        {(Object.keys(cases) as Array<keyof typeof cases>).map((key) => {
          const c = cases[key]
          return (
            <TabsContent key={key} value={key} className="mt-10">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
                <Card className="surface-card rounded-[1.25rem] p-8 md:p-9">
                  <p className="text-primary text-sm font-semibold">{c.title}</p>
                  <p className="mt-4 text-lg font-medium leading-relaxed tracking-tight">{c.summary}</p>
                  <ul className="text-muted-foreground mt-8 space-y-2.5 text-sm leading-relaxed">
                    <li>· 추천 액션 카드로 다음 작업이 정해집니다.</li>
                    <li>· 리포트는 프로젝트 단위로 보관됩니다.</li>
                    <li>· 초안 버전은 비교 후 하나로 합칩니다.</li>
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
