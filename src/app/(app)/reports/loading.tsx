import { AppHeader } from "@/components/app/app-header"
import { Card } from "@/components/ui/card"

export default function ReportsLoading() {
  return (
    <>
      <AppHeader title="리포트" description="불러오는 중…" />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <Card className="h-48 animate-pulse rounded-2xl border-border/60 bg-muted/40" />
        <Card className="h-32 animate-pulse rounded-2xl border-border/60 bg-muted/40" />
      </div>
    </>
  )
}
