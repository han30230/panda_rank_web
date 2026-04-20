import { AppHeader } from "@/components/app/app-header"

import { CompareClient } from "./compare-client"

export default function ComparePage() {
  return (
    <>
      <AppHeader
        title="본문 비교"
        description="두 글의 단어 겹침과 유사도를 브라우저에서만 계산합니다."
      />
      <div className="app-content-shell flex-1 p-4 md:p-6">
        <CompareClient />
      </div>
    </>
  )
}
