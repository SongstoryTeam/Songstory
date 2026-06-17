"use client";

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import type {Book} from "@/types";

interface BookCardProps {
    book: Pick<Book, "id" | "slug" | "title" | "author" | "coverUrl">;
    locale: string;
}

export function BookCard({book, locale}: BookCardProps) {
    const href = `/${locale}/book/${book.slug || book.id}`;

    return (
        <Link href={href} className="group flex flex-col items-center select-none">
            <div className="relative w-full pb-2">
                <motion.div
                    className="relative w-full"
                    style={{aspectRatio: "2/3"}}
                    whileHover={{y: -6, rotate: -1}}
                    transition={{duration: 0.2, ease: [0.4, 0, 0.2, 1]}}
                >
                    <div
                        className="relative w-full h-full overflow-hidden"
                        style={{
                            borderRadius: "var(--radius-sm)",
                            boxShadow:
                                "4px 4px 12px rgb(26 22 18 / 0.18), inset -3px 0 6px rgb(0 0 0 / 0.1)",
                        }}
                    >
                        {book.coverUrl ? (
                            <Image
                                src={book.coverUrl}
                                alt={`${book.title} cover`}
                                fill
                                sizes="(max-width: 768px) 100px, 130px"
                                className="object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                            />
                        ) : (
                            <NoCover title={book.title}/>
                        )}

                        <div
                            className="absolute inset-y-0 right-0 w-3 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(to right, transparent, rgb(0 0 0 / 0.12))",
                            }}
                        />
                    </div>

                    <div
                        className="absolute -bottom-2 -inset-x-1.5 h-0.5"
                        style={{
                            background: "var(--color-shelf)",
                            borderRadius: "2px",
                            boxShadow: "0 2px 4px rgb(26 22 18 / 0.15)",
                        }}
                    />
                </motion.div>
            </div>

            <div className="mt-3.5 w-full text-center">
                <p
                    className="font-medium leading-snug line-clamp-2"
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-ink)",
                    }}
                >
                    {book.title}
                </p>
                <p
                    className="mt-0.5 truncate"
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-muted)",
                    }}
                >
                    {book.author}
                </p>
            </div>
        </Link>
    );
}

function NoCover({title}: { title: string }) {
    return (
        <div
            className="w-full h-full flex items-center justify-center p-3 text-center leading-snug"
            style={{
                background: "linear-gradient(145deg, #E8E0D5, #D4C9BC)",
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
            }}
        >
            {title.slice(0, 40)}
        </div>
    );
}