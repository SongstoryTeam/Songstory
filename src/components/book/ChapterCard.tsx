import Link from "next/link";
import {ListMusic, ChevronRight} from "lucide-react";
import styles from "./ChapterCard.module.css";
import {cx} from "@/lib/cx";

interface Chapter {
    id: number;
    number: number;
    title: string;
    description: string;
    moodTags: string;
    isApproved: boolean;
    musicCount: number;
}

interface ChapterCardProps {
    chapter: Chapter;
    bookSlug: string;
    locale: string;
}

export function ChapterCard({chapter, bookSlug, locale}: ChapterCardProps) {
    return (
        <Link
            href={`/${locale}/book/${bookSlug}/chapter/${chapter.number}`}
            className={cx(styles.card, !chapter.isApproved && styles.cardPending)}
        >
            <span className={styles.number}>{chapter.number}</span>

            <div className={styles.info}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>{chapter.title}</span>
                </div>

                {(chapter.moodTags || chapter.description) && (
                    <p className={cx(styles.subtitle, chapter.moodTags ? styles.subtitleMood : styles.subtitleDesc)}>
                        {chapter.moodTags || chapter.description}
                    </p>
                )}
            </div>

            {chapter.musicCount > 0 && (
                <span className={styles.musicCount}>
          <ListMusic size={12}/>
                    {chapter.musicCount}
        </span>
            )}

            <ChevronRight size={16} className={styles.chevron}/>
        </Link>
    );
}