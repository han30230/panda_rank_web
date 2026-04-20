"use client"

import { useSearchParams } from "next/navigation"

import { KeywordAnalyzePanel } from "@/components/analyze/keyword-analyze-panel"

export function KeywordAnalyzeView() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  return <KeywordAnalyzePanel key={q ?? ""} initialKeyword={q} />
}
