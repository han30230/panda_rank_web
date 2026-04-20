import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "로그인",
  description: `${siteConfig.name} 계정으로 로그인합니다.`,
}

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100dvh-3.5rem)] lg:grid-cols-2">
      <div className="bg-muted/30 relative hidden flex-col justify-between p-12 lg:flex">
        <div>
          <p className="text-sm font-semibold">{siteConfig.name}</p>
          <h2 className="mt-8 max-w-md text-3xl font-semibold tracking-tight">
            분석과 초안이 같은 타임라인에 머무릅니다
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
            팀이 컨텍스트를 잃지 않도록 상태를 한 화면에 모았습니다.
          </p>
        </div>
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,oklch(0.52_0.12_175/0.12),transparent)]"
          aria-hidden
        />
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md rounded-3xl border-border/80 p-8 shadow-lg">
          <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            이메일과 비밀번호를 입력하세요.
          </p>
          <div className="mt-6 grid gap-3">
            <Button variant="outline" className="w-full rounded-xl" type="button">
              Google로 계속
            </Button>
            <Button variant="outline" className="w-full rounded-xl" type="button">
              Microsoft로 계속
            </Button>
          </div>
          <div className="text-muted-foreground relative my-6 text-center text-xs">
            <span className="bg-card relative z-10 px-2">또는 이메일</span>
            <span className="bg-border absolute top-1/2 right-0 left-0 -z-0 h-px" />
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" autoComplete="email" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link
                  href="#"
                  className="text-primary text-xs font-medium hover:underline"
                >
                  찾기
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="rounded-xl"
              />
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl">
              로그인
            </Button>
          </form>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            계정이 없나요?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
