import { notFound } from "next/navigation";
import { Heart, Calendar, ExternalLink, Play, Music } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Comments } from "@/components/ui/Comments";
import { serverFetch } from "@/lib/api/server-fetch";
import { PlaylistLikeButton } from "./PlaylistLikeButton";

interface ApiTrack {
  id: number;
  trackTitle: string;
  artist: string;
  linkUrl: string;
  order: number;
}

interface ApiPlaylist {
  id: number;
  slug: string;
  title: string;
  description: string;
  mood: string;
  externalLink: string;
  likesCount: number;
  isPublic: boolean;
  createdAt: string;
  creator: { id: number; username: string };
  book: { id: number; slug: string; title: string };
  tracks: ApiTrack[];
}

async function fetchPlaylist(slug: string) {
  const playlist = await serverFetch<ApiPlaylist>(`/playlists/${slug}/`, {
    revalidate: 30,
    tags: [`playlist:${slug}`],
  });
  if (!playlist) return null;
  return { ...playlist, comments: [] as never[] };
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pl = await fetchPlaylist(slug);
  if (!pl) return {};
  return { title: pl.title };
}

export default async function PlaylistDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const pl = await fetchPlaylist(slug);
  if (!pl) notFound();

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: pl.book.title, href: `/${locale}/book/${pl.book.slug}` },
    { label: pl.title },
  ];

  return (
    <div className="px-9 py-9 max-w-[760px]">
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <div
        className="flex gap-6 items-start p-7 rounded-[var(--radius-md)] border mb-7"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center w-24 h-24 rounded-[var(--radius-md)] flex-shrink-0"
          style={{
            background: "linear-gradient(145deg, var(--color-accent-lt), #E8E0D5)",
            color: "var(--color-accent)",
          }}
        >
          <Music size={40} />
        </div>

        <div className="flex-1 min-w-0">
          <h1
            className="mb-1.5 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            {pl.title}
          </h1>
          <p
            className="mb-2"
            style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
          >
            від {pl.creator.username}
          </p>

          {pl.description && (
            <p
              className="mb-3 leading-relaxed"
              style={{ fontSize: "var(--text-sm)", color: "#4A4340" }}
            >
              {pl.description}
            </p>
          )}

          <div
            className="flex items-center gap-4 flex-wrap mb-4"
            style={{ fontSize: "12.5px", color: "var(--color-muted)" }}
          >
            <span className="flex items-center gap-1.5">
              <Heart size={13} /> {pl.likesCount} вподобань
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date(pl.createdAt).toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {pl.mood && (
              <span
                className="px-2.5 py-0.5 rounded-full"
                style={{
                  background: "var(--color-accent-lt)",
                  color: "var(--color-accent)",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                {pl.mood}
              </span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <PlaylistLikeButton
              playlistId={pl.id}
              initialLiked={false}
              initialCount={pl.likesCount}
            />
            {pl.externalLink && (
              <a
                href={pl.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                <ExternalLink size={13} />
                Відкрити на платформі
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div
        className="rounded-[var(--radius-md)] border overflow-hidden mb-7"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span
            className="font-medium"
            style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
          >
            Треки ({pl.tracks.length})
          </span>
          <Link
            href={`/${locale}/playlist/${slug}/add-track`}
            className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{ color: "var(--color-muted)" }}
          >
            + Додати трек
          </Link>
        </div>

        {pl.tracks.length > 0 ? (
          pl.tracks.map((track, i) => (
            <div
              key={track.id}
              className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-[var(--color-bg)]"
              style={{
                borderBottom:
                  i < pl.tracks.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
              }}
            >
              <span
                className="text-right flex-shrink-0"
                style={{
                  minWidth: 24,
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium truncate"
                  style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
                >
                  {track.trackTitle}
                </p>
                <p
                  className="truncate"
                  style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
                >
                  {track.artist}
                </p>
              </div>
              <a
                href={track.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all hover:bg-[var(--color-accent-dk)] hover:scale-110"
                aria-label="Відтворити"
                style={{ background: "var(--color-accent)" }}
              >
                <Play size={14} fill="#fff" color="#fff" />
              </a>
            </div>
          ))
        ) : (
          <p
            className="px-5 py-8 text-center"
            style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
          >
            Треків ще немає.
          </p>
        )}
      </div>

      {/* Comments */}
      <Comments
        initialComments={pl.comments as never}
        playlistId={pl.id}
      />
    </div>
  );
}
