import Link from "next/link"

import type { AiRec } from "@/lib/dashboard-summary"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function AiRecommendations({ items }: { items: AiRec[] }) {
  return (
    <Card className="surface-card rounded-[1.05rem] px-6 py-7">
      <p className="text-sm font-semibold">추천 기능</p>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
        저장된 맥락을 바탕으로 다음 행동을 제안합니다.
      </p>
      <ul className="mt-5 space-y-4 text-sm">
        {items.map((rec) => (
          <li key={rec.id} className="rounded-xl border border-border/50 bg-muted/35 p-4">
            <p className="font-medium">{rec.title}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">{rec.description}</p>
            <Button size="sm" className="mt-3 w-full rounded-full font-medium" variant="secondary" asChild>
              <Link href={rec.href}>{rec.actionLabel}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
