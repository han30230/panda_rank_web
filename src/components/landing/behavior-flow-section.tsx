import { ArrowRight, GitCompare, LineChart, Search } from "lucide-react"
import Link from "next/link"

import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const behaviors = [
  {
    icon: Search,
    title: "키워드를 넣고",
    body: "연관 검색어와 질문형 쿼리를 자동완성처럼 띄워 각도를 고릅니다.",
    action: { label: "데모로 10초 체험", href: "/signup" },
  },
  {
    icon: LineChart,
    title: "초안·본문을 넣고",
    body: "SEO 점수·키워드 밀도·가독성을 카드로 받고, 문장 단위 피드백까지 이어집니다.",
    action: { label: "콘텐츠 작성 열기", href: "/content/new" },
  },
  {
    icon: GitCompare,
    title: "경쟁 글과 나란히",
    body: "헤딩 패턴과 토픽 갭을 비교해 ‘틈새’ 제목과 목차를 추천합니다.",
    action: { label: "키워드 분석 가기", href: "/analyze/keyword" },
  },
]

export function BehaviorFlowSection() {
  return (
    <MarketingSection id="behavior">
      <SectionHeader
        eyebrow="사용 흐름"
        title="실제 사용자 행동 기준으로 정리했습니다"
        description="입력 → 확인 → 저장까지 단계가 끊기지 않습니다. 초보자는 ‘다음’이 항상 보입니다."
      />
      <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-10">
        {behaviors.map((b) => (
          <Card
            key={b.title}
            className="surface-card flex flex-col p-7 transition-[box-shadow,border-color] hover:border-primary/25"
          >
            <div className="bg-muted mb-5 flex size-11 items-center justify-center rounded-xl">
              <b.icon className="text-foreground size-5" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{b.title}</h3>
            <p className="text-muted-foreground mt-3 flex-1 text-[15px] leading-relaxed">{b.body}</p>
            <Button variant="ghost" className="mt-8 h-auto justify-start gap-1.5 p-0 font-semibold" asChild>
              <Link href={b.action.href}>
                {b.action.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </MarketingSection>
  )
}
