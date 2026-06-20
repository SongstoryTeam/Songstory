import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server-fetch";
import { AddMusicForm } from "../AddMusicForm";

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

type Props = {
  params: Promise<{ locale: string; slug: string; num: string }>;
};

export default async function AddMusicPage({ params }: Props) {
  const { locale, slug, num } = await params;
  const book = await serverFetch<ApiBook>(`/books/${slug}/`, { revalidate: 60 });

  if (!book) notFound();

  const chapters = await serverFetch<ApiChapter[]>(`/books/${book.id}/chapters/`, {
    revalidate: 60,
  });
  const chapter = (chapters ?? []).find((c) => c.number === Number(num));

  if (!chapter) notFound();

  return (
    <AddMusicForm
      chapterId={chapter.id}
      chapterNum={chapter.number}
      chapterTitle={chapter.title}
      bookSlug={book.slug}
      bookTitle={book.title}
      locale={locale}
    />
  );
}
