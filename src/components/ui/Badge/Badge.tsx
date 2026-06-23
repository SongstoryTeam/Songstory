import {BadgeCheck} from "lucide-react";
import {useTranslations} from "next-intl";
import {cx} from "@/lib/cx";
import styles from "./Badge.module.css";

type Variant = "default" | "accent" | "danger" | "gold";

interface BadgeProps {
    children: React.ReactNode;
    variant?: Variant;
    className?: string;
}

export function Badge({children, variant = "default", className}: BadgeProps) {
    return (
        <span className={cx(styles.badge, styles[variant], className)}>
            {children}
        </span>
    );
}

export function VerifiedBadge() {
    const t = useTranslations("badges");

    return (
        <span className={styles.verified}>
            <BadgeCheck size={11} aria-hidden/>
            {t("verifiedAuthor")}
        </span>
    );
}

export function MoodBadge({mood}: { mood: string }) {
    const t = useTranslations("moods");

    return (
        <Badge variant="default">{t(mood, {defaultValue: mood})}</Badge>
    );
}