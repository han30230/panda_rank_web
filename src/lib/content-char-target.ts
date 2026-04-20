/** 사용자 지정 목표 글자 수 허용 범위 */
export const TARGET_CHARS_MIN = 800
export const TARGET_CHARS_MAX = 20000

export type ResolvedCharTarget = {
  min: number
  max: number
  /** 시스템·유저 프롬프트에 넣는 분량 지시문 */
  summary: string
  /** 휴리스틱 본문 템플릿 선택 (짧음/김) */
  bucket: "draft" | "full"
}

/**
 * `targetChars`가 있으면 우선(분량 프리셋보다 우선).
 * 없으면 length(초안/전체) 기본 범위.
 */
export function resolveCharTarget(
  length: "draft" | "full",
  targetChars?: number | null,
): ResolvedCharTarget {
  if (targetChars != null && Number.isFinite(targetChars)) {
    const n = Math.round(
      Math.min(TARGET_CHARS_MAX, Math.max(TARGET_CHARS_MIN, targetChars)),
    )
    const min = Math.max(TARGET_CHARS_MIN, Math.round(n * 0.88))
    const max = Math.min(TARGET_CHARS_MAX, Math.round(n * 1.12))
    const bucket: "draft" | "full" = n < 3800 ? "draft" : "full"
    return {
      min,
      max,
      summary: `분량·깊이: 한국어 본문 약 ${n}자를 목표로 하세요. 가능하면 ${min}~${max}자 사이로 맞추고, ◆·■ 소제목 개수와 문단 밀도를 이 분량에 맞게 조절하세요. 네이버에서 잘 읽히는 글처럼 첫 문단·소제목마다 정보가 밀도 있게 쌓이도록 하세요. 목표보다 지나치게 짧거나 길지 않게 하세요.`,
      bucket,
    }
  }

  if (length === "full") {
    return {
      min: 5000,
      max: 9000,
      summary:
        "분량·깊이: 전체 글(완성형). 한국어 약 5,000~9,000자 이상. 네이버 검색·블로그에서 상위에 자주 보이는 '의도 일치·정보 밀도·◆ 소제목 구조'를 갖추고, 글 유형에 맞는 사례·비교·주의·실무·FAQ를 빠짐없이. 한 소제목마다 여러 문단으로 구체적으로 서술하세요.",
      bucket: "full",
    }
  }

  return {
    min: 1500,
    max: 2800,
    summary:
      "분량·깊이: 초안이지만 복붙 가능한 평문. 한국어 약 1,500~2,800자. ◆ 소제목 3개 이상, 검색 의도·핵심 키워드가 첫 문단에 드러나게. 실행 포인트 위주로 네이버 블로그에 올리기 좋은 뼈대를 만드세요.",
    bucket: "draft",
  }
}

export function charTargetForClient(
  resolved: ResolvedCharTarget,
): { min: number; max: number; label: string } {
  return {
    min: resolved.min,
    max: resolved.max,
    label:
      resolved.min === resolved.max
        ? `약 ${resolved.min}자`
        : `약 ${resolved.min.toLocaleString()}~${resolved.max.toLocaleString()}자`,
  }
}
