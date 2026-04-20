"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { useAuth } from "@/contexts/auth-context"
import { signupSchema, type SignupValues } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/lib/site-config"

export function SignupForm() {
  const router = useRouter()
  const { signUp } = useAuth()

  const {
    register: field,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
  })

  async function onSubmit(data: SignupValues) {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      toast.success("계정이 만들어졌습니다. 온보딩으로 이동합니다.")
      router.push("/onboarding")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "가입에 실패했습니다.")
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          autoComplete="name"
          className="rounded-xl"
          aria-invalid={Boolean(errors.name)}
          {...field("name")}
        />
        {errors.name ? <p className="text-destructive text-xs">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded-xl"
          aria-invalid={Boolean(errors.email)}
          {...field("email")}
        />
        {errors.email ? (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          className="rounded-xl"
          aria-invalid={Boolean(errors.password)}
          {...field("password")}
        />
        {errors.password ? (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        ) : null}
      </div>
      <div className="flex items-start gap-2">
        <Controller
          name="termsAccepted"
          control={control}
          render={({ field: f }) => (
            <Checkbox
              id="terms"
              className="mt-1"
              checked={f.value === true}
              onCheckedChange={(c) => f.onChange(c === true)}
            />
          )}
        />
        <Label htmlFor="terms" className="text-muted-foreground text-xs leading-snug font-normal">
          <Link href={siteConfig.links.terms} className="text-foreground font-medium hover:underline">
            이용약관
          </Link>
          과{" "}
          <Link href={siteConfig.links.privacy} className="text-foreground font-medium hover:underline">
            개인정보처리방침
          </Link>
          에 동의합니다.
        </Label>
      </div>
      {errors.termsAccepted ? (
        <p className="text-destructive text-xs">{errors.termsAccepted.message}</p>
      ) : null}
      <Button type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? "처리 중…" : "무료로 시작"}
      </Button>
    </form>
  )
}
