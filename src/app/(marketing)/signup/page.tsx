import type { Metadata } from "next"

import { SignupPageClient } from "./signup-page-client"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "회원가입",
  description: `${siteConfig.name} 무료 체험을 시작합니다.`,
}

export default function SignupPage() {
  return <SignupPageClient />
}
