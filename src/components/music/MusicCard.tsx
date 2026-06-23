"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {Play, ExternalLink, Heart, Trash2, Clock, User} from "lucide-react";
import {useTranslations} from "next-intl";
import {cx} from "@/lib/cx";
import {usePlayerStore} from "@/store/player.store";
import {MoodBadge} from "@/components/ui/Badge/Badge";
import type {MusicRecommendation} from "@/types";
import styles from "./MusicCard.module.css";

interface MusicCardProps {
    music: MusicRecommendation;
    liked?: boolean;
    canDelete?: boolean;
    onLike?: (id: number) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

export function MusicCard({music, liked = false, canDelete = false, onLike, onDelete}: MusicCardProps) {
    const t = useTranslations("music");
    const {load} = usePlayerStore();
    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(music.likesCount);
    const [isLiking, setIsLiking] = useState(false);

    const canPlay = music.embedCode || music.linkType === "soundcloud" || music.linkType === "spotify";

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
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            className={styles.card}
        >
            <div className={styles.body}>
                <div className={styles.info}>
                    <p className={styles.trackTitle}>{music.trackTitle}</p>
                    <p className={styles.artist}>{music.artist}</p>

                    {music.comment && (
                        <blockquote className={styles.comment}>{music.comment}</blockquote>
                    )}

                    <div className={styles.meta}>
                        {music.mood && <MoodBadge mood={music.mood}/>}
                        <span className={styles.metaItem}>
                            <User size={11} aria-hidden/>
                            {music.user.username}
                        </span>
                        <span className={styles.metaItem}>
                            <Clock size={11} aria-hidden/>
                            {formatRelative(music.createdAt)}
                        </span>
                        <a
                            href={music.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.externalLink}
                        >
                            {t(`platform.${music.linkType}`)}
                            <ExternalLink size={11} aria-hidden/>
                        </a>
                    </div>
                </div>

                <div className={styles.actions}>
                    <motion.button
                        onClick={handlePlay}
                        whileHover={{scale: 1.06}}
                        whileTap={{scale: 0.96}}
                        aria-label={t("playLabel")}
                        className={styles.playButton}
                    >
                        {canPlay ? <Play size={18} fill="currentColor" aria-hidden/> :
                            <ExternalLink size={16} aria-hidden/>}
                    </motion.button>

                    {onLike && (
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            aria-label={t(isLiked ? "unlikeLabel" : "likeLabel")}
                            aria-pressed={isLiked}
                            className={cx(styles.likeButton, isLiked && styles.likeButtonActive)}
                        >
                            <Heart size={12} fill={isLiked ? "currentColor" : "none"} aria-hidden/>
                            {likeCount}
                        </button>
                    )}

                    {canDelete && onDelete && (
                        <button
                            onClick={() => onDelete(music.id)}
                            aria-label={t("deleteLabel")}
                            className={styles.deleteButton}
                        >
                            <Trash2 size={13} aria-hidden/>
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