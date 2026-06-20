import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badge";
import { BookCard } from "@/components/book/BookCard";
import { serverFetch } from "@/lib/api/server-fetch";
import { FollowButton } from "./FollowButton";

interface ApiAuthor {
  id: number;
  username: string;
  fullName: string;
  bio: string;
  followersCount: number;
  isFollowing: boolean;
  books: Array<{ id: number; slug: string; title: string; author: string; coverUrl: string | null }>;
}

async function fetchAuthor(id: number) {
  return serverFetch<ApiAuthor>(`/author/${id}/`, {
    revalidate: 60,
    tags: [`author:${id}`],
  });
}

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AuthorProfilePage({ params }: Props) {
  const { locale, id } = await params;
  const author = await fetchAuthor(Number(id));
  if (!author) notFound();

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: author.fullName },
  ];

  return (
    <div className="px-9 py-9 max-w-[860px]">
      <Breadcrumbs crumbs={crumbs} />

      <div
        className="flex items-start gap-6 p-7 rounded-[var(--radius-md)] border mb-8"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <Avatar name={author.username} size={72} />
        <div className="flex-1 min-w-0">
          <h1
            className="mb-1.5 leading-tight flex items-center flex-wrap"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            {author.fullName}
            <VerifiedBadge />
          </h1>

          <div
            className="flex items-center gap-4 mb-2"
            style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
          >
            <span>{author.followersCount} підписників</span>
            <span>{author.books.length} книг</span>
          </div>

          {author.bio && (
            <p
              className="mt-2 max-w-lg leading-relaxed"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
            >
              {author.bio}
            </p>
          )}

          <div className="mt-3.5">
            <FollowButton authorId={author.id} initialFollowing={author.isFollowing} />
          </div>
        </div>
      </div>

      <h2
        className="mb-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 600,
          color: "var(--color-ink)",
        }}
      >
        Книги цього автора
      </h2>

      {author.books.length > 0 ? (
        <div
          className="grid gap-x-5 gap-y-7"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
        >
          {author.books.map((book) => (
            <BookCard key={book.id} book={book} locale={locale} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
          Книг ще немає.
        </p>
      )}
    </div>
  );
}
