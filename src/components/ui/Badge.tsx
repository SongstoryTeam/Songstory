// @ts-ignore
import {BadgeCheck} from "lucide-react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "accent" | "danger" | "gold";
    className?: string;
}

export function Badge({children, variant = "default"}: BadgeProps) {
    const styles: Record<string, React.CSSProperties> = {
        default: {
            background: "var(--color-bg)",
            color: "var(--color-muted)",
            border: "1px solid var(--color-border)",
        },
        accent: {
            background: "var(--color-accent-lt)",
            color: "var(--color-accent)",
            border: "1px solid transparent",
        },
        danger: {
            background: "var(--color-danger-lt)",
            color: "var(--color-danger)",
            border: "1px solid rgb(192 57 43 / 0.3)",
        },
        gold: {
            background: "rgb(232 160 32 / 0.12)",
            color: "var(--color-gold)",
            border: "1px solid rgb(232 160 32 / 0.3)",
        },
    };

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 9px",
                borderRadius: "100px",
                fontSize: "11px",
                fontWeight: 500,
                ...styles[variant],
            }}
        >
      {children}
    </span>
    );
}

export function VerifiedBadge() {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--color-accent)",
                background: "var(--color-accent-lt)",
                padding: "2px 8px",
                borderRadius: "100px",
                verticalAlign: "middle",
                marginLeft: 6,
            }}
        >
      <BadgeCheck size={11}/>
      Підтверджений автор
    </span>
    );
}

const MOOD_LABELS: Record<string, string> = {
    epic: "Епічний",
    sad: "Меланхолійний",
    calm: "Спокійний",
    tense: "Напружений",
    romantic: "Романтичний",
    dark: "Темний",
    uplifting: "Піднесений",
    mysterious: "Таємничий",
};

export function MoodBadge({mood}: { mood: string }) {
    return <Badge variant="default">{MOOD_LABELS[mood] ?? mood}</Badge>;
}
