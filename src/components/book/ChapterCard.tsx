import Link from "next/link";
import { Music, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import type { Chapter } from "@/types";

interface ChapterCardProps {
  chapter: Chapter;
  bookSlug: string;
  locale: string;
}

export function ChapterCard({ chapter, bookSlug, locale }: ChapterCardProps) {
  const href = `/${locale}/book/${bookSlug}/chapter/${chapter.number}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-[18px] py-3.5 rounded-[var(--radius-md)] border transition-all group"
      style={{
        background: chapter.isApproved
          ? "var(--color-surface)"
          : "rgb(255 251 249)",
        borderColor: "var(--color-border)",
        borderStyle: chapter.isApproved ? "solid" : "dashed",
        opacity: chapter.isApproved ? 1 : 0.8,
      }}
    >
      {/* Chapter number */}
      <span
        className="font-semibold leading-none flex-shrink-0"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          color: "var(--color-accent)",
          minWidth: 40,
        }}
      >
        {chapter.number}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className="font-medium truncate"
            style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
          >
            {chapter.title}
          </p>
          {!chapter.isApproved && (
            <Badge variant="danger">На розгляді</Badge>
          )}
        </div>
        {chapter.moodTags ? (
          <p
            className="truncate italic"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-accent)",
            }}
          >
            {chapter.moodTags}
          </p>
        ) : chapter.description ? (
          <p
            className="truncate"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
            }}
          >
            {chapter.description}
          </p>
        ) : null}
      </div>

      {/* Music count */}
      <div
        className="flex items-center gap-1 flex-shrink-0"
        style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
      >
        <Music size={12} />
        {chapter.musicCount}
      </div>

      <ChevronRight
        size={15}
        style={{ color: "var(--color-border)", flexShrink: 0 }}
        className="group-hover:text-[var(--color-accent)] transition-colors"
      />
    </Link>
  );
}
