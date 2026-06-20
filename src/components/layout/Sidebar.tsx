"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  BookOpen,
  Library,
  Music,
  LogOut,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

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

export function Sidebar({ locale, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const base = `/${locale}`;

  const navItems: NavItem[] = [
    {
      href: base,
      label: "Каталог",
      icon: <Compass size={18} />,
    },
    {
      href: `${base}#catalog`,
      label: "Книги",
      icon: <BookOpen size={18} />,
    },
    ...(isAuthenticated
      ? [
          {
            href: `${base}/profile`,
            label: "Бібліотека",
            icon: <Library size={18} />,
          },
          {
            href: `${base}/profile#playlists`,
            label: "Плейлісти",
            icon: <Music size={18} />,
          },
        ]
      : []),
  ];

  const initials = user?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      {/* Overlay (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99] lg:hidden"
            style={{ background: "rgb(26 22 18 / 0.4)" }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-screen z-[100] flex flex-col transition-transform duration-200"
        style={{
          width: "var(--sidebar-w)",
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-6 py-7 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <Link href={base} onClick={onClose}>
            <span
              className="block leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                color: "var(--color-ink)",
                letterSpacing: "-0.3px",
              }}
            >
              Songstory
            </span>
            <span
              className="block uppercase tracking-widest mt-0.5"
              style={{ fontSize: "10px", color: "var(--color-muted)" }}
            >
              Книги та музика
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded"
            aria-label="Закрити меню"
            style={{ color: "var(--color-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p
            className="px-3 mb-1.5 uppercase tracking-widest"
            style={{ fontSize: "10px", fontWeight: 500, color: "var(--color-muted)" }}
          >
            Огляд
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Footer / user */}
        <div
          className="px-3 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {isAuthenticated && user ? (
            <>
              <Link
                href={`${base}/profile`}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg)] mb-2"
              >
                <UserAvatar initials={initials} />
                <div className="min-w-0">
                  <p
                    className="truncate font-medium"
                    style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
                  >
                    {user.username}
                  </p>
                  <p
                    style={{ fontSize: "11px", color: "var(--color-muted)" }}
                  >
                    {user.isVerifiedAuthor ? "Автор" : "Учасник"}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-full border transition-colors hover:bg-[var(--color-bg)] hover:border-[var(--color-ink)]"
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  color: "var(--color-muted)",
                  borderColor: "var(--color-border)",
                }}
              >
                <LogOut size={13} />
                Вийти
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={`${base}/login`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2 rounded-full transition-colors hover:bg-[var(--color-bg)] border"
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  color: "var(--color-muted)",
                  borderColor: "var(--color-border)",
                }}
              >
                <LogIn size={13} />
                Увійти
              </Link>
              <Link
                href={`${base}/signup`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2 rounded-full transition-all"
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  background: "var(--color-ink)",
                  color: "#fff",
                }}
              >
                <UserPlus size={13} />
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
}: NavItem & { active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] mb-0.5 transition-all"
      style={{
        fontSize: "var(--text-sm)",
        fontWeight: active ? 500 : 400,
        background: active ? "var(--color-accent-lt)" : "transparent",
        color: active ? "var(--color-accent)" : "var(--color-muted)",
      }}
    >
      <span style={{ opacity: active ? 1 : 0.8 }}>{icon}</span>
      {label}
    </Link>
  );
}

function UserAvatar({ initials }: { initials: string }) {
  return (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 font-medium"
      style={{
        background: "var(--color-accent)",
        color: "#fff",
        fontSize: "var(--text-sm)",
      }}
    >
      {initials}
    </div>
  );
}
