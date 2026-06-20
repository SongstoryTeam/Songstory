import type { MetadataRoute } from "next";

// In production, fetch books/chapters from the API to build the full sitemap
async function getAllBookSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://songstory.example.com";
  const locales = ["uk", "en"];
  const books = await getAllBookSlugs();

  const staticEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: locale === "uk" ? base : `${base}/${locale}`,
    changeFrequency: "daily",
    priority: 1,
  }));

  const bookEntries: MetadataRoute.Sitemap = books.flatMap((book) =>
    locales.map((locale) => ({
      url:
        locale === "uk"
          ? `${base}/book/${book.slug}`
          : `${base}/${locale}/book/${book.slug}`,
      lastModified: book.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...staticEntries, ...bookEntries];
}
