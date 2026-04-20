import {
  Bookmark,
  Bot,
  Cpu,
  GitCompare,
  Percent,
  Sparkles,
} from "lucide-react"

import { featureItems, type FeatureItem } from "@/constants/landing"
import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const iconMap: Record<
  FeatureItem["icon"],
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  sparkles: Sparkles,
  bot: Bot,
  percent: Percent,
  compare: GitCompare,
  cpu: Cpu,
  bookmark: Bookmark,
}

export function Features() {
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
        {featureItems.map((c) => {
          const Icon = iconMap[c.icon]
          return (
            <Card
              key={c.id}
              className="surface-card p-7 transition-[box-shadow,border-color] hover:border-primary/20"
            >
              <div className="bg-muted mb-5 flex size-10 items-center justify-center rounded-xl">
                <Icon className="text-foreground size-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold tracking-tight">{c.title}</h3>
              <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">{c.description}</p>
            </Card>
          )
        })}
      </div>
    </MarketingSection>
  )
}
