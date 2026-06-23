"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {Compass, BookOpen, Library, Music, LogOut, LogIn, UserPlus, X} from "lucide-react";
import {useTranslations} from "next-intl";
import {useAuthStore} from "@/store/auth.store";
import {cx} from "@/lib/cx";
import styles from "./Sidebar.module.css";

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    locale: string;
    open: boolean;
    onClose: () => void;
}

export function Sidebar({locale, open, onClose}: SidebarProps) {
    const t = useTranslations("nav");
    const pathname = usePathname();
    const {user, isAuthenticated, logout} = useAuthStore();

    const base = `/${locale}`;

    const navItems: NavItem[] = [
        {href: base, label: t("catalog"), icon: <Compass size={18} aria-hidden/>},
        {href: `${base}#catalog`, label: t("books"), icon: <BookOpen size={18} aria-hidden/>},
        ...(isAuthenticated
            ? [
                {href: `${base}/profile`, label: t("library"), icon: <Library size={18} aria-hidden/>},
                {href: `${base}/profile#playlists`, label: t("playlists"), icon: <Music size={18} aria-hidden/>},
            ]
            : []),
    ];

    const initials = user?.username?.[0]?.toUpperCase() ?? "?";

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="overlay"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                        className={styles.overlay}
                        aria-hidden
                    />
                )}
            </AnimatePresence>

            <aside className={cx(styles.sidebar, open && styles.sidebarOpen)}>
                <div className={styles.header}>
                    <Link href={base} onClick={onClose}>
                        <span className={styles.logo}>{t("appName")}</span>
                        <span className={styles.tagline}>{t("appTagline")}</span>
                    </Link>
                    <button onClick={onClose} className={styles.closeButton} aria-label={t("closeMenu")}>
                        <X size={18} aria-hidden/>
                    </button>
                </div>

                <nav className={styles.nav} aria-label={t("mainNav")}>
                    <p className={styles.navHeading}>{t("navHeading")}</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            {...item}
                            active={pathname === item.href}
                            onClick={onClose}
                        />
                    ))}
                </nav>

                <div className={styles.footer}>
                    {isAuthenticated && user ? (
                        <>
                            <Link href={`${base}/profile`} onClick={onClose} className={styles.userLink}>
                                <span className={styles.userAvatar} aria-hidden>{initials}</span>
                                <span className={styles.userInfo}>
                                    <span className={styles.userName}>{user.username}</span>
                                    <span className={styles.userRole}>
                                        {user.isVerifiedAuthor ? t("roleAuthor") : t("roleMember")}
                                    </span>
                                </span>
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                                className={styles.logoutButton}
                            >
                                <LogOut size={13} aria-hidden/>
                                {t("logout")}
                            </button>
                        </>
                    ) : (
                        <div className={styles.authActions}>
                            <Link href={`${base}/login`} onClick={onClose} className={styles.loginButton}>
                                <LogIn size={13} aria-hidden/>
                                {t("login")}
                            </Link>
                            <Link href={`${base}/signup`} onClick={onClose} className={styles.signupButton}>
                                <UserPlus size={13} aria-hidden/>
                                {t("signup")}
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

function NavLink({href, label, icon, active, onClick}: NavItem & { active: boolean; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cx(styles.navLink, active && styles.navLinkActive)}
            aria-current={active ? "page" : undefined}
        >
            <span className={styles.navIcon}>{icon}</span>
            {label}
        </Link>
    );
}