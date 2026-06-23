"use client";

import {useState} from "react";
import {Star} from "lucide-react";
import {useTranslations} from "next-intl";
import styles from "./StarRating.module.css";

interface StarRatingProps {
    value: number;
    onChange?: (score: number) => void;
    readonly?: boolean;
    size?: number;
}

export function StarRating({value, onChange, readonly = false, size = 20}: StarRatingProps) {
    const t = useTranslations("starRating");
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <div
            className={styles.wrap}
            role={readonly ? undefined : "group"}
            aria-label={readonly ? t("ratingLabel", {value}) : undefined}
        >
            {Array.from({length: 5}, (_, i) => i + 1).map((star) => {
                const filled = star <= display;
                const hovering = !readonly && star <= hovered;

                return (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        aria-label={t("starLabel", {star})}
                        aria-pressed={readonly ? undefined : star === value}
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => !readonly && setHovered(star)}
                        onMouseLeave={() => !readonly && setHovered(0)}
                        className={styles.star}
                        data-filled={filled || undefined}
                        data-hover={hovering || undefined}
                        data-readonly={readonly || undefined}
                    >
                        <Star
                            size={size}
                            fill={filled ? "currentColor" : "none"}
                            strokeWidth={1.5}
                            aria-hidden
                        />
                    </button>
                );
            })}
        </div>
    );
}