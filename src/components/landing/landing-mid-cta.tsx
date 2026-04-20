import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { MarketingSection } from "@/components/layout/marketing-section"
import { Button } from "@/components/ui/button"

type LandingMidCtaProps = {
  heading: string
  description: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

export function LandingMidCta({
  heading,
  description,
  primary,
  secondary,
}: LandingMidCtaProps) {
  return (
    <MarketingSection spacing="tight">
      <div className="surface-card flex flex-col items-start justify-between gap-8 rounded-[1.25rem] border-border/70 px-8 py-10 md:flex-row md:items-center md:px-12 md:py-12">
        <div className="max-w-xl">
          <h2 className="text-title-sm">{heading}</h2>
          <p className="text-lead mt-3">{description}</p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <Button
            className="h-11 min-w-[10rem] rounded-full px-7 font-semibold shadow-[0_3px_12px_-2px_oklch(0.52_0.12_175/0.35)]"
            asChild
          >
            <Link href={primary.href}>
              {primary.label}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" className="h-11 rounded-full border-border/80 bg-background px-6" asChild>
            <Link href={secondary.href}>{secondary.label}</Link>
          </Button>
        </div>
      </div>
    </MarketingSection>
  )
}
