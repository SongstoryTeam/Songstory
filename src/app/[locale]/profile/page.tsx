"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bookmark, Music, ListMusic, Heart, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/auth.store";

type Tab = "saved" | "playlists" | "recommendations";

// In production: fetch user-specific data from API
// These stubs keep the page self-contained
const STUB = {
  savedBooks: [] as Array<{ id: number; title: string; author: string; coverUrl: string | null }>,
  playlists: [] as Array<{ id: number; slug: string; title: string; bookTitle: string; likesCount: number }>,
  recommendations: [] as Array<{ id: number; trackTitle: string; artist: string; bookTitle: string; chapterNum: number; likesCount: number }>,
};

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("saved");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p style={{ color: "var(--color-muted)" }}>Спочатку увійдіть до акаунту.</p>
      </div>
    );
  }

  const displayName = `${user.firstName} ${user.lastName}`.trim() || user.username;

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "saved", label: "Збережені", count: STUB.savedBooks.length },
    { key: "playlists", label: "Плейлісти", count: STUB.playlists.length },
    { key: "recommendations", label: "Рекомендації", count: STUB.recommendations.length },
  ];

  return (
    <div className="px-9 py-9 max-w-3xl">
      {/* Profile header */}
      <div
        className="flex items-center gap-4 pb-7 mb-7"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <Avatar name={user.username} size={60} />
        <div className="flex-1 min-w-0">
          <h1
            className="font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              color: "var(--color-ink)",
            }}
          >
            {displayName}
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            @{user.username}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition-colors hover:bg-[var(--color-danger-lt)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            borderColor: "var(--color-border)",
            color: "var(--color-muted)",
          }}
        >
          <LogOut size={14} />
          Вийти
        </button>
      </div>

      {/* Edit panel */}
      <div
        className="rounded-[var(--radius-md)] border p-6 mb-7"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <h2
          className="font-medium mb-4"
          style={{ fontSize: "var(--text-base)", color: "var(--color-ink)" }}
        >
          Редагувати профіль
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <ProfileField
            label="Ім'я"
            value={firstName}
            onChange={setFirstName}
          />
          <ProfileField
            label="Прізвище"
            value={lastName}
            onChange={setLastName}
          />
          <ProfileField label="Email" value={user.email} readOnly />
          <ProfileField label="Username" value={user.username} readOnly />
        </div>
        <button
          className="px-5 py-2 rounded-full font-medium transition-all hover:-translate-y-px"
          style={{
            fontSize: "var(--text-sm)",
            background: "var(--color-accent)",
            color: "#fff",
          }}
        >
          Зберегти
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0.5 mb-7"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2.5 font-medium transition-all"
            style={{
              fontSize: "var(--text-sm)",
              color: activeTab === tab.key ? "var(--color-accent)" : "var(--color-muted)",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.key
                ? "2px solid var(--color-accent)"
                : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "saved" && (
            <SavedBooks books={STUB.savedBooks} />
          )}
          {activeTab === "playlists" && (
            <MyPlaylists playlists={STUB.playlists} />
          )}
          {activeTab === "recommendations" && (
            <MyRecommendations recs={STUB.recommendations} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SavedBooks({
  books,
}: {
  books: typeof STUB.savedBooks;
}) {
  if (books.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark size={22} />}
        title="Збережених немає"
        description="Переглядайте каталог і зберігайте книги, які вам подобаються."
        action={
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full font-medium"
            style={{
              fontSize: "var(--text-sm)",
              background: "var(--color-accent)",
              color: "#fff",
            }}
          >
            Переглянути книги
          </Link>
        }
      />
    );
  }

  return (
    <div
      className="grid gap-x-4 gap-y-6"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}
    >
      {books.map((book) => (
        <a key={book.id} href={`/book/${book.id}`} className="group flex flex-col gap-2">
          <div
            className="w-full rounded-[var(--radius-sm)] overflow-hidden"
            style={{
              aspectRatio: "2/3",
              background: "var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
          <p
            className="font-medium line-clamp-2 leading-snug"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-ink)" }}
          >
            {book.title}
          </p>
          <p
            className="truncate"
            style={{ fontSize: "11px", color: "var(--color-muted)" }}
          >
            {book.author}
          </p>
        </a>
      ))}
    </div>
  );
}

function MyPlaylists({ playlists }: { playlists: typeof STUB.playlists }) {
  if (playlists.length === 0) {
    return (
      <EmptyState
        icon={<Music size={22} />}
        title="Плейлістів ще немає"
        description="Створіть плейліст для улюбленої книги."
      />
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {playlists.map((pl) => (
        <a
          key={pl.id}
          href={`/playlist/${pl.slug || pl.id}`}
          className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] border transition-all hover:border-[var(--color-accent)] hover:translate-x-0.5"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div>
            <p
              className="font-medium"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
            >
              {pl.title}
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
              {pl.bookTitle}
            </p>
          </div>
          <span
            className="flex items-center gap-1"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
          >
            <Heart size={12} />
            {pl.likesCount}
          </span>
        </a>
      ))}
    </div>
  );
}

function MyRecommendations({
  recs,
}: {
  recs: typeof STUB.recommendations;
}) {
  if (recs.length === 0) {
    return (
      <EmptyState
        icon={<ListMusic size={22} />}
        title="Рекомендацій ще немає"
        description="Знайдіть розділ і поділіться тим, що слухали під час читання."
      />
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {recs.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] border"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div>
            <p
              className="font-medium"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
            >
              {r.trackTitle}
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
              {r.artist} · {r.bookTitle} — Розд. {r.chapterNum}
            </p>
          </div>
          <span
            className="flex items-center gap-1"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
          >
            <Heart size={12} />
            {r.likesCount}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label
        className="block mb-1 font-medium"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2 outline-none transition-all"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-ink)",
          background: readOnly ? "var(--color-bg)" : "var(--color-bg)",
          borderColor: "var(--color-border)",
          opacity: readOnly ? 0.65 : 1,
        }}
        onFocus={(e) => {
          if (!readOnly) {
            e.currentTarget.style.borderColor = "var(--color-accent)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgb(196 98 45 / 0.12)";
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
