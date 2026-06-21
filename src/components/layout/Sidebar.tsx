"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {Compass, BookOpen, Library, Music, LogOut, LogIn, UserPlus, X} from "lucide-react";
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
    const pathname = usePathname();
    const {user, isAuthenticated, logout} = useAuthStore();

    const base = `/${locale}`;

    const navItems: NavItem[] = [
        {href: base, label: "Каталог", icon: <Compass size={18}/>},
        {href: `${base}#catalog`, label: "Книги", icon: <BookOpen size={18}/>},
        ...(isAuthenticated
            ? [
                {href: `${base}/profile`, label: "Бібліотека", icon: <Library size={18}/>},
                {href: `${base}/profile#playlists`, label: "Плейлісти", icon: <Music size={18}/>},
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
                    />
                )}
            </AnimatePresence>

            <aside className={cx(styles.sidebar, open && styles.sidebarOpen)}>
                <div className={styles.header}>
                    <Link href={base} onClick={onClose}>
                        <span className={styles.logo}>Songstory</span>
                        <span className={styles.tagline}>Книги та музика</span>
                    </Link>
                    <button onClick={onClose} className={styles.closeButton} aria-label="Закрити меню">
                        <X size={18}/>
                    </button>
                </div>

                <nav className={styles.nav}>
                    <p className={styles.navHeading}>Огляд</p>
                    {navItems.map((item) => (
                        <NavLink key={item.href} {...item} active={pathname === item.href} onClick={onClose}/>
                    ))}
                </nav>

                <div className={styles.footer}>
                    {isAuthenticated && user ? (
                        <>
                            <Link href={`${base}/profile`} onClick={onClose} className={styles.userLink}>
                                <span className={styles.userAvatar}>{initials}</span>
                                <span className={styles.userInfo}>
                  <span className={styles.userName}>{user.username}</span>
                  <span className={styles.userRole}>{user.isVerifiedAuthor ? "Автор" : "Учасник"}</span>
                </span>
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                                className={styles.logoutButton}
                            >
                                <LogOut size={13}/>
                                Вийти
                            </button>
                        </>
                    ) : (
                        <div className={styles.authActions}>
                            <Link href={`${base}/login`} onClick={onClose} className={styles.loginButton}>
                                <LogIn size={13}/>
                                Увійти
                            </Link>
                            <Link href={`${base}/signup`} onClick={onClose} className={styles.signupButton}>
                                <UserPlus size={13}/>
                                Реєстрація
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
        <Link href={href} onClick={onClick} className={cx(styles.navLink, active && styles.navLinkActive)}>
            <span className={styles.navIcon}>{icon}</span>
            {label}
        </Link>
    );
}