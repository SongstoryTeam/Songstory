import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MusicCard } from "@/components/music/MusicCard";
import { Comments } from "@/components/ui/Comments";
import { VerifiedBadge } from "@/components/ui/Badge/Badge";
import { serverFetch } from "@/lib/api/server-fetch";

interface ApiBook {
  id: number;
  slug: string;
  title: string;
}

interface ApiMusic {
  id: number;
  trackTitle: string;
  artist: string;
  linkType: "youtube" | "spotify" | "soundcloud" | "other";
  linkUrl: string;
  embedCode: string;
  comment: string;
  mood: string;
  likesCount: number;
  createdAt: string;
  user: { id: number; username: string };
}

interface ApiComment {
  id: number;
  text: string;
  user: { id: number; username: string };
  createdAt: string;
  replies: ApiComment[];
}

async function fetchChapterData(bookSlug: string, num: number) {
  const book = await serverFetch<ApiBook>(`/books/${bookSlug}/`, { revalidate: 60 });
  if (!book) return null;

  const chapters = await serverFetch<
    { id: number; number: number; title: string; description: string; moodTags: string }[]
  >(`/books/${book.id}/chapters/`, { revalidate: 60 });

  const chapter = (chapters ?? []).find((c) => c.number === num);
  if (!chapter) return null;

  const chapterMusic = await serverFetch<ApiMusic[]>(`/chapters/${chapter.id}/music/`, {
    revalidate: 15,
    tags: [`chapter:${chapter.id}:music`],
  });

  const sorted = (chapters ?? []).sort((a, b) => a.number - b.number);
  const idx = sorted.findIndex((c) => c.number === num);

  return {
    book: { id: book.id, slug: book.slug, title: book.title },
    chapter,
    prevNum: idx > 0 ? sorted[idx - 1].number : null,
    nextNum: idx < sorted.length - 1 ? sorted[idx + 1].number : null,
    verifiedAuthorId: null as number | null,
    verifiedAuthorName: null as string | null,
    music: chapterMusic ?? [],
    comments: [] as ApiComment[],
  };
}

type Props = {
  params: Promise<{ locale: string; slug: string; num: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug, num } = await params;
  const d = await fetchChapterData(slug, Number(num));
  if (!d) return {};
  return {
    title: `${d.chapter.title} — ${d.book.title}`,
    description: `Музичні рекомендації до розділу ${d.chapter.number}: «${d.chapter.title}»`,
  };
}

export default async function ChapterDetailPage({ params }: Props) {
  const { locale, slug, num } = await params;
  const chapterNum = Number(num);
  const d = await fetchChapterData(slug, chapterNum);

  if (!d) notFound();

  const { book, chapter, prevNum, nextNum, verifiedAuthorId, verifiedAuthorName, music, comments } = d;

  const authorMusic = verifiedAuthorId
    ? music.filter((m) => m.user.id === verifiedAuthorId)
    : [];
  const otherMusic = verifiedAuthorId
    ? music.filter((m) => m.user.id !== verifiedAuthorId)
    : music;

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: book.title, href: `/${locale}/book/${book.slug}` },
    { label: `Розділ ${chapter.number}` },
  ];

  return (
    <div
      className="px-9 py-9 max-w-[860px]"
      style={{ paddingBottom: 200 }}
    >
      <Breadcrumbs crumbs={crumbs} />

      {/* Chapter header */}
      <div
        className="rounded-[var(--radius-md)] border px-7 py-6 mb-7"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <p
          className="uppercase tracking-widest mb-2"
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--color-accent)",
          }}
        >
          Розділ {chapter.number}
        </p>
        <h1
          className="mb-2.5 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 600,
            color: "var(--color-ink)",
          }}
        >
          {chapter.title}
        </h1>
        {chapter.description && (
          <p
            className="mb-3 leading-relaxed"
            style={{ fontSize: "14.5px", color: "var(--color-muted)" }}
          >
            {chapter.description}
          </p>
        )}
        {chapter.moodTags && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full italic"
            style={{
              fontSize: "12.5px",
              color: "var(--color-accent)",
              background: "var(--color-accent-lt)",
            }}
          >
            🎵 {chapter.moodTags}
          </span>
        )}
      </div>

      {/* Chapter nav */}
      <div className="flex items-center gap-2 mb-7 flex-wrap">
        {prevNum !== null && (
          <Link
            href={`/${locale}/book/${slug}/chapter/${prevNum}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
            }}
            rel="prev"
          >
            <ArrowLeft size={13} /> Розділ {prevNum}
          </Link>
        )}
        {nextNum !== null && (
          <Link
            href={`/${locale}/book/${slug}/chapter/${nextNum}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
            }}
            rel="next"
          >
            Розділ {nextNum} <ArrowRight size={13} />
          </Link>
        )}
        <Link
          href={`/${locale}/book/${slug}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border ml-auto transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            borderColor: "var(--color-border)",
            color: "var(--color-muted)",
          }}
        >
          <BookOpen size={13} /> До книги
        </Link>
      </div>

      {/* Music section header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 600,
            color: "var(--color-ink)",
          }}
        >
          Музичні рекомендації
        </h2>
        <Link
          href={`/${locale}/book/${slug}/chapter/${chapterNum}/add-music`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all hover:-translate-y-px"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            background: "var(--color-accent)",
            color: "#fff",
          }}
        >
          <Plus size={13} /> Додати музику
        </Link>
      </div>

      {/* Author picks */}
      {authorMusic.length > 0 && (
        <div
          className="rounded-[var(--radius-md)] border px-5 pt-4 pb-3 mb-6"
          style={{
            background: "linear-gradient(135deg, #FDF8F5, #FAF3ED)",
            borderColor: "rgb(196 98 45 / 0.2)",
          }}
        >
          <div
            className="flex items-center gap-2 mb-4"
            style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-ink)" }}
          >
            ✦
            <span>Вибір автора</span>
            {verifiedAuthorName && (
              <Link
                href={`/${locale}/author/${verifiedAuthorId}`}
                style={{ color: "var(--color-accent)", fontWeight: 500 }}
              >
                {verifiedAuthorName}
              </Link>
            )}
            <VerifiedBadge />
          </div>
          {authorMusic.map((m) => (
            <MusicCard
              key={m.id}
              music={{ ...m, mood: m.mood as never, likesCount: m.likesCount }}
            />
          ))}
        </div>
      )}

      {/* Community music */}
      {otherMusic.length > 0 ? (
        otherMusic.map((m) => (
          <MusicCard
            key={m.id}
            music={{ ...m, mood: m.mood as never, likesCount: m.likesCount }}
          />
        ))
      ) : authorMusic.length === 0 ? (
        <div
          className="flex flex-col items-center text-center py-14 rounded-[var(--radius-md)] border border-dashed"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="font-semibold mb-1.5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              color: "var(--color-ink)",
            }}
          >
            Музики ще немає
          </p>
          <p
            className="mb-5 max-w-xs"
            style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
          >
            Будьте першим, хто додасть трек, що передає атмосферу цього розділу.
          </p>
          <Link
            href={`/${locale}/book/${slug}/chapter/${chapterNum}/add-music`}
            className="px-6 py-2.5 rounded-full font-medium"
            style={{
              fontSize: "var(--text-sm)",
              background: "var(--color-accent)",
              color: "#fff",
            }}
          >
            Додати музику
          </Link>
        </div>
      ) : null}

      {/* Comments */}
      <Comments
        initialComments={comments as never}
        chapterId={chapter.id}
      />
    </div>
  );
}
