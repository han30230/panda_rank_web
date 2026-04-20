import { cn } from "@/lib/utils"

type SectionHeaderProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  align?: "center" | "start"
  className?: string
  /** 우측 정렬: 배지·보조 링크 등 */
  action?: React.ReactNode
}

/**
 * 섹션 헤드라인 — eyebrow → H2 → 리드 순서로 시선 고정.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  action,
}: SectionHeaderProps) {
  const isSplit = align === "start" && action

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "start" && "items-start text-left",
        isSplit && "gap-8 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          align === "center" && "mx-auto max-w-2xl",
          align === "start" && "max-w-2xl",
        )}
      >
        {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
        <h2 className={cn("text-title text-balance", eyebrow ? "mt-3" : undefined)}>
          {title}
        </h2>
        {description ? (
          <p
            className={cn("text-lead mt-4 max-w-prose", align === "center" && "mx-auto")}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 md:pb-0.5">{action}</div> : null}
    </div>
  )
}
