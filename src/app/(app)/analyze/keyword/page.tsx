import { AppHeader } from "@/components/app/app-header"
import { KeywordAnalyzePanel } from "@/components/analyze/keyword-analyze-panel"

export default function KeywordAnalyzePage() {
  return (
    <>
      <AppHeader
        title="키워드 분석"
        description="입력 → 분석 → 초안으로 이어지는 첫 단계입니다."
      />
      <div className="app-content-shell flex-1">
        <KeywordAnalyzePanel />
      </div>
    </>
  )
}
