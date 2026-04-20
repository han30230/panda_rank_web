"use client"

import { useSearchParams } from "next/navigation"

import { KeywordAnalyzePanel } from "@/components/analyze/keyword-analyze-panel"

export function KeywordAnalyzeView() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  const mode = searchParams.get("mode")
  const initialMode = mode === "extract" ? "extract" : "keyword"
  return (
    <KeywordAnalyzePanel
      key={`${q ?? ""}-${initialMode}`}
      initialKeyword={q}
      initialMode={initialMode}
    />
  )
}
