"use client";

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import type {Book} from "@/types";
import styles from "./BookCard.module.css";

interface BookCardProps {
    book: Pick<Book, "id" | "slug" | "title" | "author" | "coverUrl">;
    locale: string;
}

export function BookCard({book, locale}: BookCardProps) {
    const href = `/${locale}/book/${book.slug || book.id}`;

    return (
        <Link href={href} className={styles.card}>
            <div className={styles.coverWrap}>
                <motion.div
                    className={styles.coverInner}
                    whileHover={{y: -6, rotate: -1}}
                    transition={{duration: 0.2, ease: [0.4, 0, 0.2, 1]}}
                >
                    <div className={styles.cover}>
                        {book.coverUrl ? (
                            <Image
                                src={book.coverUrl}
                                alt={`${book.title} cover`}
                                fill
                                sizes="(max-width: 768px) 100px, 130px"
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
    return <div className={styles.noCover}>{title.slice(0, 40)}</div>;
}