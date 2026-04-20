"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
})

type FormValues = z.infer<typeof schema>

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  })

  async function onSubmit(data: FormValues) {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: data.password }),
    })
    const payload = (await res.json().catch(() => ({}))) as { error?: unknown; message?: string }
    if (!res.ok) {
      const msg =
        typeof payload.error === "string"
          ? payload.error
          : "비밀번호를 변경하지 못했습니다."
      toast.error(msg)
      return
    }
    toast.success(payload.message ?? "비밀번호가 변경되었습니다.")
    router.push("/login")
    router.refresh()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="new-password">새 비밀번호</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          className="rounded-xl"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? "저장 중…" : "비밀번호 저장"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인으로
        </Link>
      </p>
    </form>
  )
}
