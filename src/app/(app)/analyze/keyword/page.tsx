import { Suspense } from "react"

import { AppHeader } from "@/components/app/app-header"
import { KeywordAnalyzeView } from "./keyword-analyze-view"
import { Skeleton } from "@/components/ui/skeleton"

function AnalyzeFallback() {
  return (
    <div className="app-content-shell flex-1 space-y-4 p-4 md:p-6">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}

export default function KeywordAnalyzePage() {
  return (
    <>
      <AppHeader
        title="키워드 분석"
        description="입력 → 분석 → 초안으로 이어지는 첫 단계입니다."
      />
      <Suspense fallback={<AnalyzeFallback />}>
        <div className="app-content-shell flex-1">
          <KeywordAnalyzeView />
        </div>
      </Suspense>
    </>
  )
}
