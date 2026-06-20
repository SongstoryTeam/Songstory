"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { playlistsService } from "@/lib/api/services/playlists.service";

interface ChapterOption {
  id: number;
  number: number;
  title: string;
}

interface Props {
  bookId: number;
  bookSlug: string;
  bookTitle: string;
  chapters: ChapterOption[];
  locale: string;
}

export function CreatePlaylistForm({
  bookId,
  bookSlug,
  bookTitle,
  chapters,
  locale,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    mood: "",
    externalLink: "",
    isPublic: true,
    chapterId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const playlist = await playlistsService.create({
        bookId,
        title: form.title,
        description: form.description,
        mood: form.mood,
        externalLink: form.externalLink,
        isPublic: form.isPublic,
        chapterId: form.chapterId ? Number(form.chapterId) : undefined,
      });
      router.push(`/${locale}/playlist/${playlist.slug || playlist.id}`);
    } catch {
      setError("Не вдалося створити плейліст. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: bookTitle, href: `/${locale}/book/${bookSlug}` },
    { label: "Створити плейліст" },
  ];

  return (
    <div className="max-w-[540px] mx-auto px-5 py-10">
      <Breadcrumbs crumbs={crumbs} />

      <div
        className="rounded-[var(--radius-lg)] border p-9"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h1
          className="mb-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            color: "var(--color-ink)",
          }}
        >
          Новий плейліст
        </h1>
        <p
          className="mb-7"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          До книги «{bookTitle}»
        </p>

        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-[var(--radius-sm)] border-l-[3px]"
            style={{
              background: "var(--color-danger-lt)",
              borderColor: "var(--color-danger)",
              color: "#962D22",
              fontSize: "var(--text-sm)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Назва плейліста *">
            <TextInput value={form.title} onChange={(v) => patch("title", v)} required />
          </Field>

          <Field label="Опис">
            <textarea
              value={form.description}
              onChange={(e) => patch("description", e.target.value)}
              rows={3}
              className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 resize-y outline-none transition-all"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
                background: "var(--color-bg)",
                borderColor: "var(--color-border)",
                fontFamily: "inherit",
                minHeight: 80,
              }}
            />
          </Field>

          <Field label="Для конкретного розділу (необов'язково)">
            <select
              value={form.chapterId}
              onChange={(e) => patch("chapterId", e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 outline-none transition-all"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
                background: "var(--color-bg)",
                borderColor: "var(--color-border)",
                fontFamily: "inherit",
              }}
            >
              <option value="">Вся книга</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Розділ {ch.number}: {ch.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Настрій / атмосфера">
            <TextInput
              value={form.mood}
              onChange={(v) => patch("mood", v)}
              placeholder="Спокій, напруга, епічність…"
            />
          </Field>

          <Field label="Зовнішнє посилання (необов'язково)">
            <TextInput
              type="url"
              value={form.externalLink}
              onChange={(v) => patch("externalLink", v)}
              placeholder="https://open.spotify.com/playlist/…"
            />
            <small
              className="block mt-1"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
            >
              Spotify, YouTube, Apple Music тощо.
            </small>
          </Field>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => patch("isPublic", e.target.checked)}
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: "var(--color-accent)" }}
            />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}>
              Публічний плейліст
            </span>
          </label>

          <div className="flex gap-2.5 mt-2">
            <Button type="submit" variant="accent" loading={loading}>
              Створити
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/${locale}/book/${bookSlug}`)}
            >
              Скасувати
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block mb-1.5 font-medium"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 outline-none transition-all"
      style={{
        fontSize: "var(--text-sm)",
        color: "var(--color-ink)",
        background: "var(--color-bg)",
        borderColor: "var(--color-border)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgb(196 98 45 / 0.12)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}
