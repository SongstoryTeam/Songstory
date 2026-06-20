import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://songstory.example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/book/", "/playlist/"],
        disallow: ["/profile", "/comments/add", "/author/apply", "/notifications"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
