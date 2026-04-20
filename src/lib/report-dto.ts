import type { Report } from "@prisma/client"

export type ReportKind = "analyze" | "content"

export type ReportRow = {
  id: string
  title: string
  kind: ReportKind
  updatedAt: string
  status: "완료" | "검토" | "실행중"
  keyword?: string
  summary: string
  intent?: string
  outline: string[]
  meta: { title: string; description: string }
}

function parseOutline(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String)
  return []
}

export function toReportRow(r: Report): ReportRow {
  const outline = parseOutline(r.outline)
  return {
    id: r.id,
    title: r.title,
    kind: r.kind === "content" ? "content" : "analyze",
    updatedAt: r.updatedAt.toISOString().slice(0, 10),
    status: r.status as ReportRow["status"],
    keyword: r.keyword ?? undefined,
    summary: r.summary,
    intent: r.intent ?? undefined,
    outline,
    meta: { title: r.metaTitle, description: r.metaDescription },
  }
}
