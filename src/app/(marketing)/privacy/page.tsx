import type { Metadata } from "next"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${siteConfig.name} 개인정보 수집·이용 안내입니다.`,
}

export default function PrivacyPage() {
  return (
    <div className="marketing-container py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground text-sm font-medium">법무</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">개인정보처리방침</h1>
        <p className="text-muted-foreground mt-2 text-sm">시행일: {new Date().getFullYear()}년 4월 20일</p>
        <Card className="surface-card mt-10 space-y-6 rounded-3xl p-8 text-sm leading-relaxed md:p-10">
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">1. 수집 항목</h2>
            <p className="text-muted-foreground">
              회원가입·문의 시 이메일, 이름 등 계정 식별에 필요한 최소한의 정보를 수집할 수 있습니다. 서비스
              이용 과정에서 기기·접속 로그, 이용 기록이 생성되어 저장될 수 있습니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">2. 이용 목적</h2>
            <p className="text-muted-foreground">
              서비스 제공, 본인 확인, 고객 지원, 통계·품질 개선, 약관 위반 방지 및 법령 준수에 활용합니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">3. 보관 및 파기</h2>
            <p className="text-muted-foreground">
              관련 법령 또는 내부 정책에 따라 보관 기간을 정하고, 목적 달성 후 지체 없이 파기합니다. 전자적
              파일은 복구 불가 방식으로 삭제합니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">4. 제3자 제공·위탁</h2>
            <p className="text-muted-foreground">
              원칙적으로 이용자 동의 없이 외부에 제공하지 않습니다. 호스팅·결제·분석 등을 위해 필요한 경우
              위탁 처리할 수 있으며, 계약을 통해 개인정보 보호 의무를 부과합니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">5. 이용자 권리</h2>
            <p className="text-muted-foreground">
              개인정보 열람·정정·삭제·처리 정지를 요청할 수 있으며, 문의 시 신속히 조치합니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">6. 쿠키</h2>
            <p className="text-muted-foreground">
              로그인 유지·설정 저장 등을 위해 쿠키를 사용할 수 있으며, 브라우저 설정으로 거부할 수 있습니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-foreground text-base font-semibold">7. 문의</h2>
            <p className="text-muted-foreground">
              개인정보 보호 관련 문의는{" "}
              <a href={siteConfig.links.support} className="text-primary font-medium underline underline-offset-4">
                고객 지원
              </a>
              으로 연락해 주세요.
            </p>
          </section>
        </Card>
        <p className="text-muted-foreground mt-8 text-center text-xs">
          <Link href="/" className="underline-offset-4 hover:underline">
            홈으로
          </Link>
        </p>
      </div>
    </div>
  )
}
