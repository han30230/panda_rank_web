import { createHash } from "crypto"

import {
  CONTENT_POST_TYPES,
  type TrendingTopicItem,
  getTrendingTopicsForPostType,
} from "@/constants/content-studio"

const DEFAULT_RSS =
  "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko"

function decodeBasicEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

/** Google 뉴스 제목 끝의 " - 출처" 제거 */
function stripTrailingSource(title: string): string {
  const t = title.trim()
  const idx = t.lastIndexOf(" - ")
  if (idx <= 0 || idx > t.length - 4) return t
  return t.slice(0, idx).trim()
}

function extractTitlesFromRssXml(xml: string): string[] {
  const titles: string[] = []
  const itemRe = /<item>([\s\S]*?)<\/item>/gi
  let m: RegExpExecArray | null
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1]
    const tm = block.match(/<title>([\s\S]*?)<\/title>/i)
    if (!tm) continue
    let raw = tm[1].trim()
    if (raw.startsWith("<![CDATA[")) {
      raw = raw.slice(9)
      const end = raw.indexOf("]]>")
      if (end !== -1) raw = raw.slice(0, end)
    }
    const text = decodeBasicEntities(stripTrailingSource(raw))
    if (text.length >= 4) titles.push(text)
  }
  return titles
}

function headlineToKeywords(title: string): string[] {
  const base = stripTrailingSource(title)
  const chunks = base
    .split(/[\s,·/]+/)
    .map((w) => w.replace(/[^\w가-힣]/g, ""))
    .filter((w) => w.length >= 2)
  const uniq = [...new Set(chunks)]
  if (uniq.length === 0 && base.length >= 2) return [base.slice(0, 24)]
  return uniq.slice(0, 5)
}

function stableOffset(seed: string, modulo: number): number {
  if (modulo <= 0) return 0
  const h = createHash("sha256").update(seed).digest()
  return (h[0]! + (h[1]! << 8)) % modulo
}

/** 동일 RSS 풀에서 글 유형마다 다른 6개가 보이도록 시작 위치만 바꿈 */
function pickTitlesForPostType(titles: string[], postTypeId: string): string[] {
  if (titles.length === 0) return []
  const want = 6
  const n = titles.length
  const maxStart = Math.max(0, n - want)
  const start = stableOffset(postTypeId, maxStart + 1)
  const out: string[] = []
  for (let i = 0; i < want; i++) out.push(titles[(start + i) % n]!)
  return out
}

export async function fetchKrNewsHeadlines(): Promise<string[]> {
  const url = process.env.TRENDING_RSS_URL?.trim() || DEFAULT_RSS
  const res = await fetch(url, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml, */*",
      "User-Agent": "RankDeckTrending/1.0 (+https://rankdeck.example.com)",
    },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(12_000),
  })
  if (!res.ok) return []
  const xml = await res.text()
  if (!xml.includes("<rss") && !xml.includes("<item")) return []
  return extractTitlesFromRssXml(xml)
}

export function buildLiveTrendingItems(
  headlines: string[],
  postTypeId: string,
): TrendingTopicItem[] {
  const picked = pickTitlesForPostType(headlines, postTypeId)
  return picked.map((title, i) => ({
    id: `live-${postTypeId}-${i}-${stableOffset(title, 1_000_000_000)}`,
    title: title.slice(0, 100),
    keywords: headlineToKeywords(title),
    hot: i < 2,
  }))
}

export type TrendingApiResult = {
  items: TrendingTopicItem[]
  source: "live" | "fallback"
  fetchedAt: string
}

export async function getTrendingForPostType(postTypeId: string): Promise<TrendingApiResult> {
  const valid = CONTENT_POST_TYPES.some((p) => p.id === postTypeId)
  const key = valid ? postTypeId : "informative"

  let headlines: string[] = []
  try {
    headlines = await fetchKrNewsHeadlines()
  } catch {
    headlines = []
  }

  if (headlines.length >= 4) {
    return {
      items: buildLiveTrendingItems(headlines, key),
      source: "live",
      fetchedAt: new Date().toISOString(),
    }
  }

  return {
    items: [...getTrendingTopicsForPostType(key)],
    source: "fallback",
    fetchedAt: new Date().toISOString(),
  }
}
