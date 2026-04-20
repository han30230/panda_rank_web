/** 두 텍스트의 단어 집합 유사도·공통어 (클라이언트·서버 공용) */

function tokenSet(text: string): Set<string> {
  const s = new Set<string>()
  const norm = text.toLowerCase()
  for (const m of norm.matchAll(/[\uAC00-\uD7A3]{2,}/g)) {
    s.add(m[0])
  }
  for (const m of norm.matchAll(/[a-z]{3,}/g)) {
    s.add(m[0])
  }
  return s
}

export function jaccardSimilarity(a: string, b: string): number {
  const ta = tokenSet(a)
  const tb = tokenSet(b)
  if (ta.size === 0 && tb.size === 0) return 1
  if (ta.size === 0 || tb.size === 0) return 0
  let inter = 0
  for (const x of ta) {
    if (tb.has(x)) inter += 1
  }
  const union = ta.size + tb.size - inter
  return union === 0 ? 0 : inter / union
}

export function sharedTokens(a: string, b: string, limit = 24): string[] {
  const ta = tokenSet(a)
  const tb = tokenSet(b)
  const both: string[] = []
  for (const x of ta) {
    if (tb.has(x)) both.push(x)
  }
  both.sort((x, y) => y.length - x.length || x.localeCompare(y, "ko"))
  return both.slice(0, limit)
}
