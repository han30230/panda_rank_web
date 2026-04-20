"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

type Props = {
  variant?: "login" | "signup"
}

export function OauthButtons({ variant = "login" }: Props) {
  const label =
    variant === "signup" ? "Google로 가입" : "Google로 계속"
  const labelMs = variant === "signup" ? null : "Microsoft로 계속"

  function comingSoon(provider: string) {
    toast.message(`${provider} 로그인`, {
      description: "OAuth는 배포 시 클라이언트 ID를 연결하면 활성화됩니다.",
    })
  }

  return (
    <div className="grid gap-3">
      <Button
        variant="outline"
        className="w-full rounded-xl"
        type="button"
        onClick={() => comingSoon("Google")}
      >
        {label}
      </Button>
      {labelMs ? (
        <Button
          variant="outline"
          className="w-full rounded-xl"
          type="button"
          onClick={() => comingSoon("Microsoft")}
        >
          {labelMs}
        </Button>
      ) : null}
    </div>
  )
}
