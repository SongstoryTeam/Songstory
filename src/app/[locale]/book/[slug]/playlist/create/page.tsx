import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server-fetch";
import { CreatePlaylistForm } from "./CreatePlaylistForm";

interface ApiBook {
  id: number;
  slug: string;
  title: string;
}

interface ApiChapter {
  id: number;
  number: number;
  title: string;
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function CreatePlaylistPage({ params }: Props) {
  const { locale, slug } = await params;
  const book = await serverFetch<ApiBook>(`/books/${slug}/`, { revalidate: 60 });

  if (!book) notFound();

  const chapters = await serverFetch<ApiChapter[]>(`/books/${book.id}/chapters/`, {
    revalidate: 60,
  });

  return (
    <CreatePlaylistForm
      bookId={book.id}
      bookSlug={book.slug}
      bookTitle={book.title}
      chapters={chapters ?? []}
      locale={locale}
    />
  );
}
