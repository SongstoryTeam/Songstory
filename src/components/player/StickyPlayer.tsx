"use client";

import {useEffect, useRef, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {X, ExternalLink, Disc3} from "lucide-react";
import {usePlayerStore} from "@/store/player.store";
import type {LinkType} from "@/types";
import styles from "./StickyPlayer.module.css";

const PLATFORM_COLOR_VARS: Record<LinkType, string> = {
    youtube: "var(--color-platform-youtube)",
    spotify: "var(--color-platform-spotify)",
    soundcloud: "var(--color-platform-soundcloud)",
    other: "var(--color-accent)",
};

const PLATFORM_LABELS: Record<LinkType, string> = {
    youtube: "YouTube",
    spotify: "Spotify",
    soundcloud: "SoundCloud",
    other: "Link",
};

export function StickyPlayer() {
    const {current, visible, close} = usePlayerStore();
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

    const platformColor = PLATFORM_COLOR_VARS[current.linkType];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="sticky-player"
                    initial={{y: "100%", opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: "100%", opacity: 0}}
                    transition={{duration: 0.25, ease: [0.4, 0, 0.2, 1]}}
                    className={styles.player}
                    style={{borderTopColor: platformColor}}
                    role="region"
                    aria-label="Музичний плеєр"
                >
                    {embedReady && <EmbedArea track={current}/>}

                    <div className={styles.bar}>
                        <span className={styles.dot} style={{background: platformColor}}/>

                        <div className={styles.meta}>
                            <span className={styles.title}>{current.title}</span>
                            <span className={styles.artist}>{current.artist}</span>
                        </div>

                        <span className={styles.platform}>{PLATFORM_LABELS[current.linkType]}</span>

                        <a href={current.linkUrl} target="_blank" rel="noopener noreferrer" className={styles.openLink}>
                            <ExternalLink size={11}/>
                            Відкрити
                        </a>

                        <button onClick={close} aria-label="Закрити плеєр" className={styles.closeButton}>
                            <X size={14}/>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface EmbedProps {
    track: NonNullable<ReturnType<typeof usePlayerStore.getState>["current"]>;
}

function EmbedArea({track}: EmbedProps) {
    if (track.linkType === "spotify" && track.embedCode) {
        return <SpotifyEmbed embedCode={track.embedCode} linkUrl={track.linkUrl}/>;
    }
    if (track.linkType === "soundcloud") {
        return <SoundCloudEmbed linkUrl={track.linkUrl}/>;
    }
    if (track.linkType === "youtube" && track.embedCode) {
        return <YouTubePreview embedCode={track.embedCode} linkUrl={track.linkUrl} title={track.title}/>;
    }
    return null;
}

function SpotifyEmbed({embedCode, linkUrl}: { embedCode: string; linkUrl: string }) {
    const [showEmbed, setShowEmbed] = useState(true);

    return (
        <div className={styles.embedSpotify}>
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
                    icon={<Disc3 size={20} className={styles.spotifyIcon}/>}
                    label="Відкрити в Spotify"
                />
            )}
        </div>
    );
}

function SoundCloudEmbed({linkUrl}: { linkUrl: string }) {
    const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(linkUrl)}&color=%23c4622d&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;

    return (
        <div className={styles.embedSoundcloud}>
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

function YouTubePreview({embedCode, linkUrl, title}: { embedCode: string; linkUrl: string; title: string }) {
    const thumb = `https://img.youtube.com/vi/${embedCode}/mqdefault.jpg`;

    return (
        <div className={styles.embedYoutube}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt="" aria-hidden className={styles.youtubeThumb}/>
            <div className={styles.youtubeOverlay}>
                <div className={styles.youtubePlayIcon}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.youtubeLink}>
                    {title} — відкрити на YouTube
                </a>
            </div>
        </div>
    );
}

function FallbackEmbed({linkUrl, icon, label}: { linkUrl: string; icon: React.ReactNode; label: string }) {
    return (
        <div className={styles.fallback}>
            {icon}
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>
                {label}
            </a>
        </div>
    );
}