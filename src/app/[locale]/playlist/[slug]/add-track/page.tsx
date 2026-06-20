import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server-fetch";
import { AddTrackForm } from "./AddTrackForm";

interface ApiPlaylist {
  id: number;
  slug: string;
  title: string;
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function AddTrackPage({ params }: Props) {
  const { locale, slug } = await params;
  const playlist = await serverFetch<ApiPlaylist>(`/playlists/${slug}/`, {
    revalidate: 30,
  });

  if (!playlist) notFound();

  return (
    <AddTrackForm
      playlistId={playlist.id}
      playlistSlug={playlist.slug}
      playlistTitle={playlist.title}
      locale={locale}
    />
  );
}
