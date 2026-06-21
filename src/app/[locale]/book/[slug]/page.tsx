import { notFound } from "next/navigation";
import { Eye, Calendar, BookOpen, Star, ListMusic, Plus } from "lucide-react";
import { BookCover } from "@/components/book/BookCover";
import { ChapterCard } from "@/components/book/ChapterCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VerifiedBadge } from "@/components/ui/Badge/Badge";
import { serverFetch } from "@/lib/api/server-fetch";
import { BookDetailClient } from "./BookDetailClient";

interface ApiBook {
  id: number;
  slug: string;
  title: string;
  author: string;
  genre: string | null;
  year: number;
  coverUrl: string | null;
  description?: string;
  viewsCount: number;
  averageRating: number;
  ratingsCount: number;
  isVerifiedAuthor?: boolean;
}

interface ApiChapter {
  id: number;
  number: number;
  title: string;
  description: string;
  moodTags: string;
  isApproved: boolean;
  musicCount: number;
}

interface ApiMusic {
  id: number;
  trackTitle: string;
  artist: string;
  linkUrl: string;
  likesCount: number;
  chapter?: { number: number };
}

async function fetchBook(slug: string) {
  const book = await serverFetch<ApiBook>(`/books/${slug}/`, {
    revalidate: 60,
    tags: [`book:${slug}`],
  });
  if (!book) return null;

  const [chapters, topMusic] = await Promise.all([
    serverFetch<ApiChapter[]>(`/books/${book.id}/chapters/`, { revalidate: 60 }),
    serverFetch<ApiMusic[]>(`/books/${book.id}/top-music/`, { revalidate: 60 }),
  ]);

  return {
    ...book,
    authorSlug: null,
    isVerifiedAuthor: book.isVerifiedAuthor ?? false,
    description: book.description ?? "",
    chapters: chapters ?? [],
    topMusic: (topMusic ?? []).map((m) => ({
      id: m.id,
      trackTitle: m.trackTitle,
      artist: m.artist,
      linkUrl: m.linkUrl,
      likesCount: m.likesCount,
      chapterNumber: m.chapter?.number ?? 0,
    })),
  };
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const book = await fetchBook(slug);
  if (!book) return {};
  return {
    title: `${book.title} — ${book.author}`,
    description: book.description || `Музичні рекомендації до книги «${book.title}»`,
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const book = await fetchBook(slug);

  if (!book) notFound();

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: book.title },
  ];

  return (
    <div className="px-9 py-9 max-w-5xl">
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <div
        className="grid gap-9 mb-9"
        style={{ gridTemplateColumns: "200px 1fr" }}
      >
        {/* Cover with shelf */}
        <div className="relative pb-2.5">
          <BookCover src={book.coverUrl} title={book.title} width={200} height={300} />
          {/* Shelf */}
          <div
            aria-hidden
            className="absolute -bottom-0 -inset-x-2 h-0.5"
            style={{
              background: "var(--color-shelf)",
              borderRadius: 2,
              boxShadow: "0 3px 6px rgb(26 22 18 / 0.12)",
            }}
          />
        </div>

        {/* Info */}
        <div className="pt-1">
          {book.genre && (
            <span
              className="inline-flex mb-3 px-2.5 py-0.5 rounded-full uppercase tracking-widest"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--color-accent)",
                background: "var(--color-accent-lt)",
              }}
            >
              {book.genre}
            </span>
          )}

          <h1
            className="mb-1.5 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.375rem, 3.5vw, 2.25rem)",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            {book.title}
          </h1>

          <p className="mb-4" style={{ fontSize: "var(--text-md)", color: "var(--color-muted)" }}>
            {book.author}
            {book.isVerifiedAuthor && <VerifiedBadge />}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap mb-4" style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> {book.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={13} /> {book.viewsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} /> {book.chapters.length} розд.
            </span>
            {book.averageRating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star size={13} style={{ color: "var(--color-gold)" }} />
                <strong style={{ color: "var(--color-ink)" }}>{book.averageRating}</strong>
                <span>({book.ratingsCount})</span>
              </span>
            )}
          </div>

          {book.description && (
            <p
              className="mb-5 leading-relaxed max-w-lg"
              style={{ fontSize: "14.5px", color: "#4A4340" }}
            >
              {book.description}
            </p>
          )}

          {/* Actions */}
          <BookDetailClient book={{ id: book.id, slug: book.slug, averageRating: book.averageRating }} locale={locale} />
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 300px" }}>
        {/* Chapters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                color: "var(--color-ink)",
              }}
            >
              Розділи
            </h2>
            <a
              href={`/${locale}/book/${book.slug}/chapters/add`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              <Plus size={13} /> Додати
            </a>
          </div>

          <div className="flex flex-col gap-2">
            {book.chapters.map((ch) => (
              <ChapterCard
                key={ch.id}
                chapter={ch}
                bookSlug={book.slug}
                locale={locale}
              />
            ))}
            {book.chapters.length === 0 && (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                Розділів ще немає.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar — top music */}
        {book.topMusic.length > 0 && (
          <aside>
            <div
              className="rounded-[var(--radius-md)] border overflow-hidden"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div
                className="flex items-center gap-2 px-[18px] py-4"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                }}
              >
                <Star size={14} style={{ color: "var(--color-gold)" }} />
                Топ треків до книги
              </div>
              <div className="p-3.5 flex flex-col gap-1">
                {book.topMusic.map((track) => (
                  <a
                    key={track.id}
                    href={track.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg)]"
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] flex-shrink-0"
                      style={{ background: "var(--color-accent-lt)", color: "var(--color-accent)" }}
                    >
                      <ListMusic size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate font-medium"
                        style={{ fontSize: "var(--text-xs)", color: "var(--color-ink)" }}
                      >
                        {track.trackTitle}
                      </p>
                      <p
                        className="truncate"
                        style={{ fontSize: "11px", color: "var(--color-muted)" }}
                      >
                        {track.artist} · Розд.{track.chapterNumber}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
