import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "회원가입",
  description: `${siteConfig.name} 무료 체험을 시작합니다.`,
}

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-border/80 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">계정 만들기</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          7일 동안 핵심 기능을 제한적으로 무료로 씁니다.
        </p>
        <div className="mt-6 grid gap-3">
          <Button variant="outline" className="w-full rounded-xl" type="button">
            Google로 가입
          </Button>
        </div>
        <div className="text-muted-foreground relative my-6 text-center text-xs">
          <span className="bg-card relative z-10 px-2">또는 이메일</span>
          <span className="bg-border absolute top-1/2 right-0 left-0 -z-0 h-px" />
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" name="name" autoComplete="name" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" autoComplete="email" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="rounded-xl"
            />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="terms" className="mt-1" />
            <Label htmlFor="terms" className="text-muted-foreground text-xs leading-snug font-normal">
              <Link href="#" className="text-foreground font-medium hover:underline">
                이용약관
              </Link>
              과{" "}
              <Link href="#" className="text-foreground font-medium hover:underline">
                개인정보처리방침
              </Link>
              에 동의합니다.
            </Label>
          </div>
          <Button className="h-11 w-full rounded-xl" asChild>
            <Link href="/onboarding">무료로 시작</Link>
          </Button>
        </form>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            로그인
          </Link>
        </p>
      </Card>
    </div>
  )
}
