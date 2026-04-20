import Link from "next/link"

import { AppHeader } from "@/components/app/app-header"
import { ContentStudioPanel } from "@/components/content/content-studio-panel"
import { Button } from "@/components/ui/button"

export default function NewContentPage() {
  return (
    <>
      <AppHeader
        title="콘텐츠 작성"
        description="왼쪽에서 입력하고 오른쪽에서 점수·초안·메타를 한 번에 확인합니다."
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
