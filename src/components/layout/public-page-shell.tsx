import { Navbar } from "@/components/layout/navbar"
import { SiteFooter } from "@/components/marketing/site-footer"

type PublicPageShellProps = {
  children: React.ReactNode
}

/** 마케팅·공개 페이지 공통: 네비 + 본문 + 푸터 */
export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  )
}
