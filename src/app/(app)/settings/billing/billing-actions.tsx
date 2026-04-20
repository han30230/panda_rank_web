"use client"

import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function BillingActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button className="rounded-full" asChild>
        <Link href="/pricing">플랜 변경</Link>
      </Button>
      <Button
        variant="outline"
        className="rounded-full"
        type="button"
        onClick={() =>
          toast.message("결제 수단", {
            description: "Stripe·토스 등 연동 시 이 화면에서 카드를 등록·변경할 수 있습니다.",
          })
        }
      >
        결제 수단 관리
      </Button>
    </div>
  )
}
