"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/store/player.store";
import { EmbedArea } from "./PlayerEmbeds";
import type { LinkType } from "@/types";
import styles from "./StickyPlayer.module.css";

const PLATFORM_COLOR_VARS: Record<LinkType, string> = {
    youtube: "var(--color-platform-youtube)",
    spotify: "var(--color-platform-spotify)",
    soundcloud: "var(--color-platform-soundcloud)",
    other: "var(--color-accent)",
};

const EMBED_DELAY_MS = 80;

const PLAYER_ANIMATION = {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

export function StickyPlayer() {
    const t = useTranslations("player");
    const { current, visible, close } = usePlayerStore();
    const [embedReady, setEmbedReady] = useState(false);
    const prevIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (current?.id !== prevIdRef.current) {
            setEmbedReady(false);
            prevIdRef.current = current?.id ?? null;
            const timer = setTimeout(() => setEmbedReady(true), EMBED_DELAY_MS);
            return () => clearTimeout(timer);
        }
    }, [current?.id]);

    if (!current) return null;

    const platformColor = PLATFORM_COLOR_VARS[current.linkType];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="sticky-player"
                    {...PLAYER_ANIMATION}
                    className={styles.player}
                    style={{ borderTopColor: platformColor }}
                    role="region"
                    aria-label={t("regionLabel")}
                >
                    {embedReady && <EmbedArea track={current} />}

                    <div className={styles.bar}>
                        <span className={styles.dot} style={{ background: platformColor }} aria-hidden />

                        <div className={styles.meta}>
                            <span className={styles.trackTitle}>{current.title}</span>
                            <span className={styles.artist}>{current.artist}</span>
                        </div>

                        <span className={styles.platform} aria-hidden>
                            {t(`platform.${current.linkType}`)}
                        </span>

                        <a
                            href={current.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.openLink}
                        >
                            <ExternalLink size={11} aria-hidden />
                            {t("openLabel")}
                        </a>

                        <button onClick={close} aria-label={t("closeLabel")} className={styles.closeButton}>
                            <X size={14} aria-hidden />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}