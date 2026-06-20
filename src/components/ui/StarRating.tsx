"use client";

import {useState} from "react";
import {Star} from "lucide-react";

interface StarRatingProps {
    value: number;
    onChange?: (score: number) => void;
    readonly?: boolean;
    size?: number;
}

export function StarRating({
                               value,
                               onChange,
                               readonly = false,
                               size = 20,
                           }: StarRatingProps) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <div className="flex items-center gap-1" role={readonly ? undefined : "group"}>
            {Array.from({length: 5}, (_, i) => i + 1).map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    aria-label={`Оцінка ${star} з 5`}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => !readonly && setHovered(0)}
                    style={{
                        background: "none",
                        border: "none",
                        padding: 2,
                        cursor: readonly ? "default" : "pointer",
                        color: star <= display ? "var(--color-gold)" : "var(--color-border)",
                        transition: "color 150ms ease, transform 150ms ease",
                        transform:
                            !readonly && star <= hovered ? "scale(1.15)" : "scale(1)",
                        lineHeight: 1,
                    }}
                >
                    <Star
                        size={size}
                        fill={star <= display ? "currentColor" : "none"}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    );
}
