import {
  Bookmark,
  Bot,
  Cpu,
  GitCompare,
  Percent,
  Sparkles,
} from "lucide-react"

import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const capabilities = [
  {
    icon: Sparkles,
    title: "자동완성",
    body: "키워드·질문형 쿼리를 입력 중에 제안합니다.",
  },
  {
    icon: Bot,
    title: "AI 추천",
    body: "제목·목차·메타를 후보로 띄우고 고릅니다.",
  },
  {
    icon: Percent,
    title: "점수화",
    body: "SEO·가독성·키워드 적합도를 숫자로 압축합니다.",
  },
  {
    icon: GitCompare,
    title: "비교",
    body: "상위 글·자사 글을 구조 단위로 맞춥니다.",
  },
  {
    icon: Cpu,
    title: "추출",
    body: "URL·본문에서 엔티티와 헤딩을 뽑습니다.",
  },
  {
    icon: Bookmark,
    title: "저장",
    body: "프로젝트·버전 단위로 리포트를 보관합니다.",
  },
] as const

export function CapabilitiesSection() {
  return (
    <MarketingSection id="capabilities" variant="muted">
      <SectionHeader
        align="start"
        eyebrow="기능 맵"
        title="자주 쓰는 동작을 화면 곳곳에서 같은 이름으로"
        description="대시보드·분석·작성에 동일한 라벨을 씁니다. 메뉴를 외우지 않아도 됩니다."
        action={
          <Badge variant="secondary" className="h-fit px-3 py-1.5 text-xs font-medium">
            6가지 핵심
          </Badge>
        }
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {capabilities.map((c) => (
          <Card
            key={c.title}
            className="surface-card p-7 transition-[box-shadow,border-color] hover:border-primary/20"
          >
            <div className="bg-muted mb-5 flex size-10 items-center justify-center rounded-xl">
              <c.icon className="text-foreground size-5" aria-hidden />
            </div>
            <h3 className="text-base font-semibold tracking-tight">{c.title}</h3>
            <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">{c.body}</p>
          </Card>
        ))}
      </div>
    </MarketingSection>
  )
}
