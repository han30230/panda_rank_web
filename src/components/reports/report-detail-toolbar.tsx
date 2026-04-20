"use client"

import { FileDown, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ReportDetailToolbarProps = {
  reportId: string
  className?: string
}

async function downloadPdf(reportId: string) {
  try {
    const res = await fetch(`/api/reports/${reportId}/export`, {
      credentials: "include",
    })
    if (!res.ok) {
      toast.error("PDF를 만들지 못했습니다", {
        description: "로그인 상태를 확인해 주세요.",
      })
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${reportId.slice(0, 8)}.pdf`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("PDF를 내려받았습니다")
  } catch {
    toast.error("다운로드에 실패했습니다")
  }
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
        onClick={() => void downloadPdf(reportId)}
      >
        <FileDown className="size-3.5" />
        PDF 내보내기
      </Button>
    </div>
  )
}
