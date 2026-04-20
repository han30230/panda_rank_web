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
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button size="sm" variant="outline" className="rounded-full border-[#00C95A]/40 text-[#008f45] hover:bg-[#00C95A]/10" asChild>
              <Link href="/chat/tool/influencer/post">판다 AI (인플루언서)</Link>
            </Button>
            <Button size="sm" variant="outline" className="rounded-full" asChild>
              <Link href="/dashboard">대시보드</Link>
            </Button>
          </div>
        }
      />
      <div className="app-content-shell flex-1">
        <ContentStudioPanel />
      </div>
    </>
  )
}
