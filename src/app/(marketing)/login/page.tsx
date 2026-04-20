import type { Metadata } from "next"

import { LoginPageClient } from "./login-page-client"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "로그인",
  description: `${siteConfig.name} 계정으로 로그인합니다.`,
}

export default function LoginPage() {
  return <LoginPageClient />
}
