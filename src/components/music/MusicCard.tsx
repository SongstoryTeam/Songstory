"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, Heart, Trash2, Clock, User } from "lucide-react";
import { usePlayerStore } from "@/store/player.store";
import type { MusicRecommendation } from "@/types";

const MOOD_LABELS: Record<string, string> = {
  epic: "Епічний",
  sad: "Меланхолійний",
  calm: "Спокійний",
  tense: "Напружений",
  romantic: "Романтичний",
  dark: "Темний",
  uplifting: "Піднесений",
  mysterious: "Таємничий",
};

const LINK_LABELS: Record<string, string> = {
  youtube: "YouTube",
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  other: "Слухати",
};

interface MusicCardProps {
  music: MusicRecommendation;
  liked?: boolean;
  canDelete?: boolean;
  onLike?: (id: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export function MusicCard({
  music,
  liked = false,
  canDelete = false,
  onLike,
  onDelete,
}: MusicCardProps) {
  const { load } = usePlayerStore();
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(music.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const canPlay =
    music.embedCode ||
    music.linkType === "soundcloud" ||
    music.linkType === "spotify";

  function handlePlay() {
    if (!canPlay) {
      window.open(music.linkUrl, "_blank", "noopener,noreferrer");
      return;
    }
    load({
      id: music.id,
      title: music.trackTitle,
      artist: music.artist,
      linkType: music.linkType,
      embedCode: music.embedCode,
      linkUrl: music.linkUrl,
    });
  }

  async function handleLike() {
    if (!onLike || isLiking) return;
    setIsLiking(true);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      await onLike(music.id);
    } catch {
      setIsLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setIsLiking(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[var(--radius-md)] border overflow-hidden mb-3"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex gap-4 p-4 items-start">
        <div className="flex-1 min-w-0">
          <p
            className="font-medium leading-tight mb-0.5"
            style={{ fontSize: "var(--text-md)", color: "var(--color-ink)" }}
          >
            {music.trackTitle}
          </p>
          <p
            className="mb-3"
            style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
          >
            {music.artist}
          </p>

          {music.comment && (
            <blockquote
              className="mb-3 py-2.5 px-3.5 rounded-r-[var(--radius-sm)] leading-relaxed italic"
              style={{
                fontSize: "var(--text-sm)",
                color: "#4A4340",
                background: "var(--color-bg)",
                borderLeft: "3px solid var(--color-accent)",
              }}
            >
              {music.comment}
            </blockquote>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {music.mood && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full border"
                style={{
                  fontSize: "var(--text-2xs)",
                  fontWeight: 500,
                  color: "var(--color-muted)",
                  borderColor: "var(--color-border)",
                  background: "var(--color-bg)",
                }}
              >
                {MOOD_LABELS[music.mood] ?? music.mood}
              </span>
            )}
            <span
              className="flex items-center gap-1"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
              }}
            >
              <User size={11} />
              {music.user.username}
            </span>
            <span
              className="flex items-center gap-1"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
              }}
            >
              <Clock size={11} />
              {formatRelative(music.createdAt)}
            </span>
            <a
              href={music.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                color: "var(--color-accent)",
              }}
            >
              {LINK_LABELS[music.linkType] ?? "Слухати"}
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Actions column */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <motion.button
            onClick={handlePlay}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Відтворити"
            className="flex items-center justify-center w-11 h-11 rounded-full transition-colors"
            style={{
              background: "var(--color-accent-lt)",
              color: "var(--color-accent)",
            }}
          >
            {canPlay ? <Play size={18} fill="currentColor" /> : <ExternalLink size={16} />}
          </motion.button>

          {onLike && (
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all"
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                background: isLiked ? "#FEF0EB" : "var(--color-surface)",
                borderColor: isLiked ? "var(--color-accent)" : "var(--color-border)",
                color: isLiked ? "var(--color-accent)" : "var(--color-muted)",
              }}
            >
              <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
              {likeCount}
            </button>
          )}

          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(music.id)}
              aria-label="Видалити"
              className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--color-danger-lt)]"
              style={{
                color: "var(--color-danger)",
                borderColor: "rgb(192 57 43 / 0.25)",
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function formatRelative(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}хв тому`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}год тому`;
  const days = Math.floor(hours / 24);
  return `${days}д тому`;
}
