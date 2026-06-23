"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";
import {Search, Menu, Plus, Bell} from "lucide-react";
import {useTranslations} from "next-intl";
import {useAuthStore} from "@/store/auth.store";
import {useDebouncedCallback} from "@/lib/hooks";
import styles from "./TopBar.module.css";

interface TopBarProps {
    locale: string;
    onMenuClick: () => void;
}

export function TopBar({locale, onMenuClick}: TopBarProps) {
    const t = useTranslations("topbar");
    const router = useRouter();
    const {isAuthenticated} = useAuthStore();
    const [query, setQuery] = useState("");

    const pushSearch = useDebouncedCallback((value: string) => {
        if (!value.trim()) return;
        router.push(`/${locale}?search=${encodeURIComponent(value.trim())}`);
    }, 400);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);
        pushSearch(value);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/${locale}?search=${encodeURIComponent(query.trim())}`);
        }
    }

    return (
        <header className={styles.topbar}>
            <button onClick={onMenuClick} aria-label={t("openMenu")} className={styles.menuButton}>
                <Menu size={20} aria-hidden/>
            </button>

            <form onSubmit={handleSubmit} className={styles.search} role="search">
                <Search size={16} className={styles.searchIcon} aria-hidden/>
                <input
                    type="search"
                    value={query}
                    onChange={handleChange}
                    placeholder={t("searchPlaceholder")}
                    className={styles.searchInput}
                    aria-label={t("searchLabel")}
                />
            </form>

            <div className={styles.spacer}/>

            <div className={styles.actions}>
                {isAuthenticated && (
                    <Link href={`/${locale}/notifications`} aria-label={t("notifications")}
                          className={styles.iconButton}>
                        <Bell size={16} aria-hidden/>
                    </Link>
                )}
                {isAuthenticated ? (
                    <Link href={`/${locale}/book/create`} className={styles.createButton}>
                        <Plus size={15} aria-hidden/>
                        {t("addBook")}
                    </Link>
                ) : (
                    <>
                        <Link href={`/${locale}/login`} className={styles.loginLink}>
                            {t("login")}
                        </Link>
                        <Link href={`/${locale}/signup`} className={styles.signupLink}>
                            {t("signup")}
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}