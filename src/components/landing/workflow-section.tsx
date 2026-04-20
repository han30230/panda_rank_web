import { FileSearch, LineChart, PenLine, Rocket } from "lucide-react"

import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Card } from "@/components/ui/card"

const steps = [
  {
    icon: FileSearch,
    title: "입력",
    desc: "키워드·URL·톤을 정하고 분석 범위를 선택합니다.",
  },
  {
    icon: LineChart,
    title: "분석",
    desc: "의도·연관 주제·헤딩 갭을 한 화면에서 확인합니다.",
  },
  {
    icon: PenLine,
    title: "초안",
    desc: "버전별 초안과 메타·스니펫을 함께 다룹니다.",
  },
  {
    icon: Rocket,
    title: "최적화",
    desc: "체크리스트로 온페이지를 정리하고 내보냅니다.",
  },
]

export function WorkflowSection() {
  return (
    <MarketingSection id="workflow" variant="band">
      <SectionHeader
        eyebrow="엔드 투 엔드"
        title="입력 → 점수 → 저장까지 한 흐름"
        description="업무용 SaaS처럼 단계가 고정되어 있고, 안내 문구로 다음 클릭이 보입니다."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {steps.map((s, i) => (
          <Card
            key={s.title}
            className="surface-card relative p-7 transition-[box-shadow] hover:shadow-md"
          >
            <span className="text-muted-foreground absolute right-5 top-5 text-xs font-medium tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="bg-primary/10 text-primary mb-5 flex size-11 items-center justify-center rounded-xl">
              <s.icon className="size-5" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{s.desc}</p>
          </Card>
        ))}
      </div>
    </MarketingSection>
  )
}
