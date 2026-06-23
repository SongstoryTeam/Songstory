"use client";

import {useState} from "react";
import {Disc3} from "lucide-react";
import {useTranslations} from "next-intl";
import type {PlayerTrack} from "@/types";
import styles from "./StickyPlayer.module.css";

interface EmbedProps {
    track: PlayerTrack;
}

export function EmbedArea({track}: EmbedProps) {
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
    const t = useTranslations("player");
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
                    title={t("spotifyPlayerTitle")}
                    onError={() => setShowEmbed(false)}
                />
            ) : (
                <FallbackEmbed
                    linkUrl={linkUrl}
                    icon={<Disc3 size={20} className={styles.spotifyIcon} aria-hidden/>}
                    label={t("openInSpotify")}
                />
            )}
        </div>
    );
}

function SoundCloudEmbed({linkUrl}: { linkUrl: string }) {
    const t = useTranslations("player");
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
                title={t("soundcloudPlayerTitle")}
            />
        </div>
    );
}

function YouTubePreview({embedCode, linkUrl, title}: { embedCode: string; linkUrl: string; title: string }) {
    const t = useTranslations("player");
    const thumb = `https://img.youtube.com/vi/${embedCode}/mqdefault.jpg`;

    return (
        <div className={styles.embedYoutube}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt="" aria-hidden className={styles.youtubeThumb}/>
            <div className={styles.youtubeOverlay}>
                <div className={styles.youtubePlayIcon} aria-hidden>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.youtubeLink}>
                    {t("openOnYoutube", {title})}
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
