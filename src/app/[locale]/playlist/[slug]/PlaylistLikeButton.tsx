"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { playlistsService } from "@/lib/api/services/playlists.service";

interface Props {
  playlistId: number;
  initialLiked: boolean;
  initialCount: number;
}

export function PlaylistLikeButton({ playlistId, initialLiked, initialCount }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      await playlistsService.like(playlistId);
    } catch {
      setLiked(wasLiked);
      setCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all"
      style={{
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        background: liked ? "#FEF0EB" : "var(--color-surface)",
        borderColor: liked ? "var(--color-accent)" : "var(--color-border)",
        color: liked ? "var(--color-accent)" : "var(--color-muted)",
      }}
    >
      <Heart size={13} fill={liked ? "currentColor" : "none"} />
      {liked ? "Вподобано" : "Вподобати"} · {count}
    </button>
  );
}
