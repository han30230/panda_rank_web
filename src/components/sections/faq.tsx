import Link from "next/link"

import { faqItems } from "@/constants/faq"
import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export function Faq() {
  return (
    <MarketingSection id="faq" variant="muted">
      <SectionHeader
        eyebrow="전환"
        title="결제 전에 걸리는 질문"
        description="저장 위치·채널·한도를 먼저 공개합니다. 불확실성을 줄여 전환을 돕습니다."
      />
      <Accordion type="single" collapsible className="mx-auto mt-12 w-full max-w-3xl">
        {faqItems.map((item, i) => (
          <AccordionItem key={item.question} value={`faq-${i}`} className="border-border/60">
            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <Button
          size="lg"
          className="min-w-[12rem] rounded-full px-10 font-semibold shadow-[0_4px_14px_-2px_oklch(0.52_0.12_175/0.35)]"
          asChild
        >
          <Link href="/dashboard">무료로 시작</Link>
        </Button>
        <Button variant="ghost" className="rounded-full text-sm font-medium" asChild>
          <a href="mailto:support@example.com">문의하기</a>
        </Button>
      </div>
    </MarketingSection>
  )
}
