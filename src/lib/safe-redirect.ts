/** 오픈 리다이렉트 방지: 내부 경로만 허용 */
export function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/")) return "/dashboard"
  if (raw.startsWith("//")) return "/dashboard"
  if (raw.includes("://")) return "/dashboard"
  return raw.split("#")[0] ?? "/dashboard"
}
