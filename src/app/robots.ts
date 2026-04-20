import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/settings/",
        "/workspace/",
        "/reports/",
        "/analyze/",
        "/content/",
        "/onboarding",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
