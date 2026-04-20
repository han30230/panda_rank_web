import { cn } from "@/lib/utils"

type MarketingSectionProps = {
  id?: string
  variant?: "default" | "muted" | "band"
  spacing?: "default" | "tight"
  /** true면 `marketing-container` 없이 전체 폭(히어로 배경 등) */
  bleed?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * 마케팅 페이지 섹션 래퍼 — 세로 리듬·표면 구분을 일관 적용합니다.
 */
export function MarketingSection({
  id,
  variant = "default",
  spacing = "default",
  bleed = false,
  className,
  children,
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        spacing === "default" ? "section-y" : "section-y-tight",
        variant === "muted" && "border-border/45 bg-muted/30 border-y",
        variant === "band" && "border-border/40 bg-muted/20 border-y",
        className,
      )}
    >
      {bleed ? children : <div className="marketing-container">{children}</div>}
    </section>
  )
}
