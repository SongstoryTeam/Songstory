"use client";

import Link from "next/link";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {motion} from "framer-motion";
import type {Book} from "@/types";
import styles from "./BookCard.module.css";

const COVER_HOVER = {y: -6, rotate: -1};
const COVER_TRANSITION = {duration: 0.2, ease: [0.4, 0, 0.2, 1] as const};
const COVER_SIZES = "(max-width: 768px) 100px, 130px";
const NO_COVER_TRIM = 40;

interface BookCardProps {
    book: Pick<Book, "id" | "slug" | "title" | "author" | "coverUrl">;
    locale: string;
}

export function BookCard({book, locale}: BookCardProps) {
    const t = useTranslations("book");
    const href = `/${locale}/book/${book.slug || book.id}`;

    return (
        <Link href={href} className={styles.card}>
            <div className={styles.coverWrap}>
                <motion.div
                    className={styles.coverInner}
                    whileHover={COVER_HOVER}
                    transition={COVER_TRANSITION}
                >
                    <div className={styles.cover}>
                        {book.coverUrl ? (
                            <Image
                                src={book.coverUrl}
                                alt={t("coverAlt", {title: book.title})}
                                fill
                                sizes={COVER_SIZES}
                                className={styles.coverImage}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                            />
                        ) : (
                            <NoCover title={book.title}/>
                        )}
                        <div className={styles.spine} aria-hidden/>
                    </div>
                    <div className={styles.shelf} aria-hidden/>
                </motion.div>
            </div>

            <div className={styles.meta}>
                <p className={styles.title}>{book.title}</p>
                <p className={styles.author}>{book.author}</p>
            </div>
        </Link>
    );
}

function NoCover({title}: { title: string }) {
    return <div className={styles.noCover}>{title.slice(0, NO_COVER_TRIM)}</div>;
}