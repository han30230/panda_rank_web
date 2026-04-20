import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Coins,
  FileText,
  Gauge,
} from "lucide-react"

import type { KpiTrend } from "@/constants/dashboard"
import type { DashboardKpi } from "@/lib/dashboard-summary"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

const icons: Record<string, typeof BarChart3> = {
  "weekly-analysis": BarChart3,
  "avg-seo": Gauge,
  drafts: FileText,
  credits: Coins,
}

function TrendTag({ trend, delta }: { trend: KpiTrend; delta: string }) {
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums",
        trend === "up" && "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
        trend === "down" && "bg-amber-500/10 text-amber-900 dark:text-amber-200",
        trend === "flat" && "bg-muted text-muted-foreground",
      )}
    >
      {Icon ? <Icon className="size-3" aria-hidden /> : null}
      {delta}
    </span>
  )
}

export function KpiCards({ kpis }: { kpis: DashboardKpi[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {kpis.map((k) => {
        const Icon = icons[k.id] ?? BarChart3
        return (
          <Card
            key={k.id}
            className="surface-analytics relative overflow-hidden rounded-[1.05rem] px-6 py-6 md:px-7 md:py-7"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide">
                {k.label}
              </p>
              <span className="bg-primary/12 text-primary flex size-9 items-center justify-center rounded-xl">
                <Icon className="size-4" aria-hidden />
              </span>
            </div>
            <p className="tabular-kpi mt-4 text-[1.85rem] leading-none">{k.value}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TrendTag trend={k.trend} delta={k.delta} />
            </div>
            <p className="text-muted-foreground mt-2 text-[11px] leading-snug">{k.hint}</p>
          </Card>
        )
      })}
    </div>
  )
}
