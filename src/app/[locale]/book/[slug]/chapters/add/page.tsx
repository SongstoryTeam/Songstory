import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server-fetch";
import { AddChaptersForm } from "./AddChaptersForm";

interface ApiBook {
  id: number;
  slug: string;
  title: string;
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function AddChaptersPage({ params }: Props) {
  const { locale, slug } = await params;
  const book = await serverFetch<ApiBook>(`/books/${slug}/`, { revalidate: 60 });

  if (!book) notFound();

  return (
    <AddChaptersForm
      bookId={book.id}
      bookSlug={book.slug}
      bookTitle={book.title}
      locale={locale}
    />
  );
}
