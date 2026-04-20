import Link from "next/link"

import { siteConfig } from "@/lib/site-config"

const footerLinks = {
  product: [
    { label: "기능", href: "/#capabilities" },
    { label: "요금제", href: "/pricing" },
    { label: "대시보드", href: "/dashboard" },
  ],
  legal: [
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">제품</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {footerLinks.product.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">법무</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {footerLinks.legal.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground mt-12 border-t border-border/60 pt-8 text-xs">
          © {new Date().getFullYear()} {siteConfig.name}. 데모 목적의 UI입니다.
        </p>
      </div>
    </footer>
  )
}
