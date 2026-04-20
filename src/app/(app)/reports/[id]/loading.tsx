import { AppHeader } from "@/components/app/app-header"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportDetailLoading() {
  return (
    <>
      <AppHeader title="리포트 불러오는 중…" description="잠시만 기다려 주세요." />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex flex-wrap gap-2 sm:hidden">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md rounded-xl" />
          <Card className="rounded-2xl border-border/60 p-6 shadow-none">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4 max-w-lg" />
            <Skeleton className="my-6 h-px w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-4 w-full max-w-sm" />
          </Card>
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </>
  )
}
