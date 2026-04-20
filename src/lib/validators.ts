import { z } from "zod"

export const emailSchema = z.string().trim().email("올바른 이메일 형식이 아닙니다.")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
})

export const signupSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(80),
  email: emailSchema,
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  termsAccepted: z.boolean().refine((v) => v === true, { message: "약관에 동의해 주세요." }),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "유효한 링크가 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
})

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
