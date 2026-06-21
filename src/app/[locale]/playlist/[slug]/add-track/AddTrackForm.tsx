"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button/Button";
import axiosInstance from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface Props {
  playlistId: number;
  playlistSlug: string;
  playlistTitle: string;
  locale: string;
}

export function AddTrackForm({ playlistId, playlistSlug, playlistTitle, locale }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ trackTitle: "", artist: "", linkUrl: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function patch<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.trackTitle.trim() || !form.linkUrl.trim()) return;
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(ENDPOINTS.playlists.tracks(playlistId), {
        track_title: form.trackTitle,
        artist: form.artist,
        link_url: form.linkUrl,
      });
      router.push(`/${locale}/playlist/${playlistSlug}`);
    } catch {
      setError("Не вдалося додати трек. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: playlistTitle, href: `/${locale}/playlist/${playlistSlug}` },
    { label: "Додати трек" },
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
          Новий трек
        </h1>
        <p
          className="mb-7"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          До плейліста «{playlistTitle}»
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
          <Field label="Назва треку">
            <TextInput
              value={form.trackTitle}
              onChange={(v) => patch("trackTitle", v)}
              required
            />
          </Field>
          <Field label="Виконавець">
            <TextInput value={form.artist} onChange={(v) => patch("artist", v)} />
          </Field>
          <Field label="Посилання">
            <TextInput
              type="url"
              value={form.linkUrl}
              onChange={(v) => patch("linkUrl", v)}
              placeholder="https://…"
              required
            />
          </Field>

          <div className="flex gap-2.5 mt-2">
            <Button type="submit" variant="accent" loading={loading}>
              Додати трек
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/${locale}/playlist/${playlistSlug}`)}
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
