export type ReportKind = "analyze" | "content"

export type MockReport = {
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

const reports: Record<string, MockReport> = {
  r_kw_7f3a: {
    id: "r_kw_7f3a",
    title: "미니멀 책상 정리",
    kind: "analyze",
    updatedAt: "2026-04-18",
    status: "완료",
    keyword: "미니멀 책상 정리",
    summary:
      "정보형 검색이 주를 이루며 체크리스트·비교 포맷이 유리합니다. '실패 사례' 각도는 경쟁 갭입니다.",
    intent: "정보형 + 실행 체크리스트",
    outline: [
      "들어가며: 왜 지금 정리가 필요한가",
      "준비물과 공간 측정",
      "3단계 정리 프로세스",
      "유지 루틴과 자주 묻는 질문",
    ],
    meta: {
      title: "미니멀 책상 정리 완벽 가이드 | 2026",
      description: "적은 도구로 책상을 비우는 순서와 유지 루틴을 정리했습니다.",
    },
  },
  r_ct_draft_2: {
    id: "r_ct_draft_2",
    title: "재택근무 생산성 가이드",
    kind: "content",
    updatedAt: "2026-04-17",
    status: "검토",
    keyword: "재택근무 생산성",
    summary: "초안 v2. 메타 길이가 권장을 약간 초과했습니다. H2에 '도구' 섹션 추가 권장.",
    intent: "정보형",
    outline: ["환경 세팅", "집중 블록", "회의 최소화", "번아웃 신호"],
    meta: {
      title: "재택근무 생산성: 집중 블록으로 하루를 나누기",
      description: "환경·시간·회의 세 가지 레버만으로 생산성을 끌어올리는 방법.",
    },
  },
  r_kw_91bc: {
    id: "r_kw_91bc",
    title: "캠핑용 버너 추천",
    kind: "analyze",
    updatedAt: "2026-04-16",
    status: "실행중",
    keyword: "캠핑용 버너",
    summary: "상위 결과에 비교표와 안전 팁이 공통입니다. '초보 실수' 토픽이 비어 있습니다.",
    intent: "비교 + 구매 보조",
    outline: ["버너 종류 한눈에 보기", "안전 체크리스트", "예산별 추천", "관리·세척"],
    meta: {
      title: "캠핑용 버너 고르기: 안전·출력·무게 기준",
      description: "초보 캠퍼도 실수하지 않는 선택 기준과 추천 조합.",
    },
  },
}

export function getMockReport(id: string): MockReport | null {
  return reports[id] ?? null
}

export function listMockReports(): MockReport[] {
  return Object.values(reports).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}
