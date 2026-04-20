/**
 * 본문에서 빈도 기반 키워드 후보를 뽑습니다 (형태소 분석 없음, 한글·영문 토큰).
 */

const KOREAN_STOP = new Set([
  "그리고",
  "하지만",
  "그러나",
  "그래서",
  "때문에",
  "위해서",
  "통해서",
  "대해서",
  "있습니다",
  "없습니다",
  "합니다",
  "됩니다",
  "입니다",
  "습니다",
  "에서는",
  "으로서",
  "같습니다",
  "합니다",
  "이렇게",
  "저렇게",
  "그렇게",
  "어떻게",
  "무엇을",
  "무엇이",
  "이것은",
  "저것은",
  "그것은",
  "우리는",
  "당신은",
  "여기에",
  "거기에",
  "이번에",
  "다음에",
  "이전에",
  "정도로",
  "경우에",
  "때문에",
  "있는",
  "없는",
  "하는",
  "되는",
  "같은",
  "같이",
  "위한",
  "대한",
  "통한",
  "또한",
  "및",
  "등",
  "때",
  "것",
  "수",
  "등",
])

const SHORT_STOP = new Set([
  "이",
  "가",
  "을",
  "를",
  "은",
  "는",
  "의",
  "에",
  "와",
  "과",
  "도",
  "만",
  "로",
  "으로",
  "나",
  "더",
  "잘",
  "안",
  "못",
  "좀",
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "its",
  "may",
  "new",
  "now",
  "old",
  "see",
  "two",
  "way",
  "who",
  "boy",
  "did",
])

export type KeywordExtractHit = { term: string; count: number }

export function extractKeywordsFromText(
  raw: string,
  limit = 20,
): KeywordExtractHit[] {
  const text = raw.replace(/\s+/g, " ").trim()
  if (!text) return []

  const counts = new Map<string, number>()

  for (const m of text.matchAll(/[\uAC00-\uD7A3]{2,}/g)) {
    const w = m[0]
    if (KOREAN_STOP.has(w) || SHORT_STOP.has(w)) continue
    counts.set(w, (counts.get(w) ?? 0) + 1)
  }

  for (const m of text.matchAll(/[a-zA-Z]{3,}/g)) {
    const w = m[0].toLowerCase()
    if (SHORT_STOP.has(w)) continue
    counts.set(w, (counts.get(w) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
    .slice(0, Math.max(1, Math.min(100, limit)))
    .map(([term, count]) => ({ term, count }))
}
