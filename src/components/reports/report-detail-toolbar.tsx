"use client"

import { FileDown, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ReportDetailToolbarProps = {
  reportId: string
  className?: string
}

async function copyShareUrl(reportId: string) {
  const origin =
    typeof window !== "undefined" ? window.location.origin : ""
  const url = `${origin}/reports/${reportId}`
  try {
    await navigator.clipboard.writeText(url)
    toast.success("공유 링크를 복사했습니다", {
      description: url,
      duration: 4000,
    })
  } catch {
    toast.error("클립보드에 복사하지 못했습니다", {
      description: "브라우저 권한을 확인해 주세요.",
    })
  }
}

export function ReportDetailToolbar({ reportId, className }: ReportDetailToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full gap-1.5"
        type="button"
        onClick={() => void copyShareUrl(reportId)}
      >
        <Share2 className="size-3.5" />
        공유
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full gap-1.5"
        type="button"
        onClick={() =>
          toast.info("내보내기는 준비 중입니다", {
            description: "PDF·마크다운 내보내기는 곧 제공됩니다.",
          })
        }
      >
        <FileDown className="size-3.5" />
        내보내기
      </Button>
    </div>
  )
}
