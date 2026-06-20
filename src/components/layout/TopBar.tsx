"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, Plus, Bell } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useDebouncedCallback } from "@/lib/hooks";

interface TopBarProps {
  locale: string;
  onMenuClick: () => void;
}

export function TopBar({ locale, onMenuClick }: TopBarProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
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
    <header
      className="sticky top-0 z-50 flex items-center gap-5 px-5 lg:px-9 h-[60px] flex-shrink-0"
      style={{
        background: "rgb(247 244 239 / 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        aria-label="Відкрити меню"
        className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--color-surface)] lg:hidden"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-ink)",
        }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 h-[38px] rounded-full border flex-1 max-w-[320px] transition-all focus-within:shadow-sm"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <Search
          size={16}
          style={{ color: "var(--color-muted)", flexShrink: 0 }}
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Пошук книг або авторів…"
          className="flex-1 min-w-0 bg-transparent outline-none"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
        />
      </form>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Link
            href={`/${locale}/notifications`}
            aria-label="Сповіщення"
            className="flex items-center justify-center w-9 h-9 rounded-full border transition-colors hover:bg-[var(--color-surface)]"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            <Bell size={16} />
          </Link>
        )}
        {isAuthenticated ? (
          <Link
            href={`/${locale}/book/create`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all hover:-translate-y-px"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              background: "var(--color-accent)",
              color: "#fff",
              boxShadow: "0 2px 8px rgb(196 98 45 / 0.3)",
            }}
          >
            <Plus size={15} />
            Додати книгу
          </Link>
        ) : (
          <>
            <Link
              href={`/${locale}/login`}
              className="px-4 py-2 rounded-full border transition-colors hover:bg-[var(--color-surface)] hover:border-[var(--color-ink)]"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              Увійти
            </Link>
            <Link
              href={`/${locale}/signup`}
              className="px-4 py-2 rounded-full transition-all hover:-translate-y-px"
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                background: "var(--color-accent)",
                color: "#fff",
                boxShadow: "0 2px 8px rgb(196 98 45 / 0.3)",
              }}
            >
              Реєстрація
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
