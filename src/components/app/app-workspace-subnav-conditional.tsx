"use client"

import { usePathname } from "next/navigation"

import { AppWorkspaceSubnav } from "@/components/app/app-workspace-subnav"

/** 판다랭크형 채팅 도구 경로에서는 상단 탭 바를 숨겨 전체 높이를 씁니다. */
export function AppWorkspaceSubnavConditional() {
  const pathname = usePathname()
  if (pathname.startsWith("/chat/tool")) {
    return null
  }
  return <AppWorkspaceSubnav />
}
