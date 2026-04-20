"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

type ReportMetaCopyButtonProps = {
  title: string
  description: string
}

export function ReportMetaCopyButton({ title, description }: ReportMetaCopyButtonProps) {
  async function copyMeta() {
    const text = `제목: ${title}\n설명: ${description}`
    try {
      await navigator.clipboard.writeText(text)
      toast.success("메타 문구를 복사했습니다")
    } catch {
      toast.error("복사에 실패했습니다")
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="shrink-0 rounded-full gap-1.5"
      type="button"
      onClick={() => void copyMeta()}
    >
      <Copy className="size-3.5" />
      복사
    </Button>
  )
}
