import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const items = [
  {
    q: "네이버 블로그만 분석할 수 있나요?",
    a: "아니요. 키워드·본문·메타 분석은 채널에 상관없이 동일한 인사이트를 제공합니다. 네이버 블로그 운영에 맞춘 가이드 템플릿을 기본으로 두었습니다.",
  },
  {
    q: "작성한 글과 리포트는 어디에 저장되나요?",
    a: "계정 단위 프로젝트에 암호화 저장됩니다. 팀 플랜에서는 워크스페이스별 공유 범위를 나눌 수 있습니다.",
  },
  {
    q: "무료 체험은 어떻게 제한되나요?",
    a: "분석 횟수와 생성 크레딧에 일일 상한이 있습니다. 대시보드에서 실시간 잔여량을 확인할 수 있습니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "결제일 기준 7일 이내 첫 구독에 한해 전액 환불을 제공합니다. 자세한 조건은 이용약관을 확인해 주세요.",
  },
  {
    q: "API 연동이 가능한가요?",
    a: "팀 플랜 이상에서 웹훅과 읽기 전용 API 키를 제공합니다. (데모 빌드에서는 UI만 포함됩니다.)",
  },
]

export function FaqSection() {
  return (
    <MarketingSection id="faq" variant="muted">
      <SectionHeader
        eyebrow="전환"
        title="결제 전에 걸리는 질문"
        description="저장 위치·채널·한도를 먼저 공개합니다. 불확실성을 줄여 전환을 돕습니다."
      />
      <Accordion type="single" collapsible className="mx-auto mt-12 w-full max-w-3xl">
        {items.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`} className="border-border/60">
            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <Button size="lg" className="min-w-[12rem] rounded-full px-10 font-semibold shadow-[0_4px_14px_-2px_oklch(0.52_0.12_175/0.35)]" asChild>
          <Link href="/dashboard">무료로 시작</Link>
        </Button>
        <Button variant="ghost" className="rounded-full text-sm font-medium" asChild>
          <a href="mailto:support@example.com">문의하기</a>
        </Button>
      </div>
    </MarketingSection>
  )
}
