import {BadgeCheck} from "lucide-react";
import {cx} from "@/lib/cx";
import styles from "./Badge.module.css";

type Variant = "default" | "accent" | "danger" | "gold";

interface BadgeProps {
    children: React.ReactNode;
    variant?: Variant;
    className?: string;
}

export function Badge({children, variant = "default", className}: BadgeProps) {
    return <span className={cx(styles.badge, styles[variant], className)}>{children}</span>;
}

export function VerifiedBadge() {
    return (
        <span className={styles.verified}>
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