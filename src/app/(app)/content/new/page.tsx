import Link from "next/link"

import { AppHeader } from "@/components/app/app-header"
import { ContentStudioPanel } from "@/components/content/content-studio-panel"
import { Button } from "@/components/ui/button"

export default function NewContentPage() {
  return (
    <>
      <AppHeader
        title="콘텐츠 작성"
        description="블로그 유형·키워드·AI 생성을 한 화면에서 처리합니다."
        action={
          <Button size="sm" variant="outline" className="rounded-full" asChild>
            <Link href="/dashboard">대시보드</Link>
          </Button>
        }
      />
      <div className="app-content-shell flex-1">
        <ContentStudioPanel />
      </div>
    </>
  )
}
