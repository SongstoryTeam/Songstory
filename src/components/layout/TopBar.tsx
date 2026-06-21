"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";
import {Search, Menu, Plus, Bell} from "lucide-react";
import {useAuthStore} from "@/store/auth.store";
import {useDebouncedCallback} from "@/lib/hooks";
import styles from "./TopBar.module.css";

interface TopBarProps {
    locale: string;
    onMenuClick: () => void;
}

export function TopBar({locale, onMenuClick}: TopBarProps) {
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
            <button onClick={onMenuClick} aria-label="Відкрити меню" className={styles.menuButton}>
                <Menu size={20}/>
            </button>

            <form onSubmit={handleSubmit} className={styles.search}>
                <Search size={16} className={styles.searchIcon}/>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Пошук книг або авторів…"
                    className={styles.searchInput}
                />
            </form>

            <div className={styles.spacer}/>

            <div className={styles.actions}>
                {isAuthenticated && (
                    <Link href={`/${locale}/notifications`} aria-label="Сповіщення" className={styles.iconButton}>
                        <Bell size={16}/>
                    </Link>
                )}
                {isAuthenticated ? (
                    <Link href={`/${locale}/book/create`} className={styles.createButton}>
                        <Plus size={15}/>
                        Додати книгу
                    </Link>
                ) : (
                    <>
                        <Link href={`/${locale}/login`} className={styles.loginLink}>
                            Увійти
                        </Link>
                        <Link href={`/${locale}/signup`} className={styles.signupLink}>
                            Реєстрація
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}