import Link from "next/link";
import {ChevronRight} from "lucide-react";
import {useTranslations} from "next-intl";
import styles from "./Breadcrumbs.module.css";

interface Crumb {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    crumbs: Crumb[];
}

export function Breadcrumbs({crumbs}: BreadcrumbsProps) {
    const t = useTranslations("nav");

    return (
        <nav aria-label={t("breadcrumbs")} className={styles.nav}>
            {crumbs.map((crumb, i) => (
                <span key={i} className={styles.item}>
                    {i > 0 && <ChevronRight size={13} className={styles.separator} aria-hidden/>}
                    {crumb.href ? (
                        <Link href={crumb.href} className={styles.link}>
                            {crumb.label}
                        </Link>
                    ) : (
                        <span aria-current="page" className={styles.current}>
                            {crumb.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}