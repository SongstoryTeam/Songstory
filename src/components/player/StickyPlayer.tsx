"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Disc3 } from "lucide-react";
import { usePlayerStore } from "@/store/player.store";
import type { LinkType } from "@/types";

const PLATFORM_COLORS: Record<LinkType, string> = {
  youtube: "#FF0000",
  spotify: "#1DB954",
  soundcloud: "#FF5500",
  other: "var(--color-accent)",
};

const PLATFORM_LABELS: Record<LinkType, string> = {
  youtube: "YouTube",
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  other: "Link",
};

export function StickyPlayer() {
  const { current, visible, close } = usePlayerStore();
  const [embedReady, setEmbedReady] = useState(false);
  const prevIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (current?.id !== prevIdRef.current) {
      setEmbedReady(false);
      prevIdRef.current = current?.id ?? null;
      const t = setTimeout(() => setEmbedReady(true), 80);
      return () => clearTimeout(t);
    }
  }, [current?.id]);

  if (!current) return null;

  const platformColor = PLATFORM_COLORS[current.linkType];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-player"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 right-0 z-[200] flex flex-col"
          style={{
            left: "var(--sidebar-w)",
            background: "#1C1917",
            borderTop: `2px solid ${platformColor}`,
          }}
          role="region"
          aria-label="Музичний плеєр"
        >
          {/* Embed area */}
          {embedReady && <EmbedArea track={current} />}

          {/* Control bar */}
          <div className="flex items-center gap-3 px-4 h-[52px] flex-shrink-0">
            {/* Platform dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
              style={{ background: platformColor }}
            />

            {/* Track meta */}
            <div className="flex-1 min-w-0 flex flex-col gap-px">
              <span
                className="truncate font-medium leading-tight"
                style={{ fontSize: "var(--text-sm)", color: "#fff" }}
              >
                {current.title}
              </span>
              <span
                className="truncate"
                style={{
                  fontSize: "11px",
                  color: "rgb(255 255 255 / 0.45)",
                }}
              >
                {current.artist}
              </span>
            </div>

            {/* Platform label */}
            <span
              className="flex-shrink-0 uppercase tracking-wide"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                color: "rgb(255 255 255 / 0.3)",
              }}
            >
              {PLATFORM_LABELS[current.linkType]}
            </span>

            {/* Open externally */}
            <a
              href={current.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border flex-shrink-0 transition-all hover:border-white/35 hover:text-white"
              style={{
                fontSize: "11.5px",
                fontWeight: 500,
                color: "rgb(255 255 255 / 0.55)",
                borderColor: "rgb(255 255 255 / 0.12)",
              }}
            >
              <ExternalLink size={11} />
              Відкрити
            </a>

            {/* Close */}
            <button
              onClick={close}
              aria-label="Закрити плеєр"
              className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] border flex-shrink-0 transition-all hover:text-white hover:border-white/18 hover:bg-white/7"
              style={{
                color: "rgb(255 255 255 / 0.4)",
                borderColor: "rgb(255 255 255 / 0.08)",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Embed sub-component ────────────────────────────────────────────────────

interface EmbedProps {
  track: NonNullable<ReturnType<typeof usePlayerStore.getState>["current"]>;
}

function EmbedArea({ track }: EmbedProps) {
  if (track.linkType === "spotify" && track.embedCode) {
    return <SpotifyEmbed embedCode={track.embedCode} linkUrl={track.linkUrl} />;
  }

  if (track.linkType === "soundcloud") {
    return <SoundCloudEmbed linkUrl={track.linkUrl} />;
  }

  if (track.linkType === "youtube" && track.embedCode) {
    return <YouTubePreview embedCode={track.embedCode} linkUrl={track.linkUrl} title={track.title} />;
  }

  return null;
}

function SpotifyEmbed({ embedCode, linkUrl }: { embedCode: string; linkUrl: string }) {
  const [showEmbed, setShowEmbed] = useState(true);

  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{ height: 152, background: "#1C1917" }}
    >
      {showEmbed ? (
        <iframe
          src={`https://open.spotify.com/embed/track/${embedCode}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          loading="lazy"
          title="Spotify player"
          onError={() => setShowEmbed(false)}
        />
      ) : (
        <FallbackEmbed
          linkUrl={linkUrl}
          icon={<Disc3 size={20} style={{ color: "#1DB954" }} />}
          label="Відкрити в Spotify"
        />
      )}
    </div>
  );
}

function SoundCloudEmbed({ linkUrl }: { linkUrl: string }) {
  const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(linkUrl)}&color=%23c4622d&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;

  return (
    <div
      className="flex-shrink-0 overflow-hidden"
      style={{ height: 166, background: "#1C1917" }}
    >
      <iframe
        src={src}
        width="100%"
        height="166"
        frameBorder="0"
        scrolling="no"
        allow="autoplay"
        title="SoundCloud player"
      />
    </div>
  );
}

function YouTubePreview({
  embedCode,
  linkUrl,
  title,
}: {
  embedCode: string;
  linkUrl: string;
  title: string;
}) {
  const thumb = `https://img.youtube.com/vi/${embedCode}/mqdefault.jpg`;

  return (
    <div
      className="relative flex items-center overflow-hidden flex-shrink-0"
      style={{ height: 80, background: "#1C1917" }}
    >
      {/* Blurred thumbnail background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-35 blur-sm pointer-events-none"
      />

      {/* YouTube play button */}
      <div className="relative z-10 flex items-center gap-4 px-4">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
          style={{ background: "rgb(255 0 0 / 0.85)" }}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="#fff"
            className="ml-0.5"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline underline-offset-2 text-white/85 hover:text-white transition-opacity"
        >
          {title} — відкрити на YouTube
        </a>
      </div>
    </div>
  );
}

function FallbackEmbed({
  linkUrl,
  icon,
  label,
}: {
  linkUrl: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center h-full gap-3">
      {icon}
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-white/70 hover:text-white underline underline-offset-2 transition-colors"
      >
        {label}
      </a>
    </div>
  );
}
