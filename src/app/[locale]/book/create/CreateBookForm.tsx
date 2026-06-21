"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button/Button";
import axiosInstance from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface Props {
  locale: string;
}

export function CreateBookForm({ locale }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    author: "",
    year: new Date().getFullYear(),
    genre: "",
    description: "",
    coverUrl: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    setLoading(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("author", form.author);
      payload.append("year", String(form.year));
      payload.append("genre", form.genre);
      payload.append("description", form.description);
      if (form.coverUrl) payload.append("cover_url", form.coverUrl);
      if (coverFile) payload.append("cover_image", coverFile);

      const { data } = await axiosInstance.post(ENDPOINTS.books.list, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/${locale}/book/${data.slug || data.id}`);
    } catch {
      setError("Не вдалося додати книгу. Перевірте дані та спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: "Додати книгу" },
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
          Нова книга
        </h1>
        <p
          className="mb-7"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          Додайте книгу до каталогу Songstory
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
          <Field label="Назва *">
            <TextInput
              value={form.title}
              onChange={(v) => patch("title", v)}
              required
            />
          </Field>

          <Field label="Автор *">
            <TextInput
              value={form.author}
              onChange={(v) => patch("author", v)}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Рік *">
              <TextInput
                type="number"
                value={String(form.year)}
                onChange={(v) => patch("year", Number(v) || form.year)}
                required
              />
            </Field>
            <Field label="Жанр">
              <TextInput
                value={form.genre}
                onChange={(v) => patch("genre", v)}
                placeholder="Фентезі, роман…"
              />
            </Field>
          </div>

          <Field label="Опис">
            <textarea
              value={form.description}
              onChange={(e) => patch("description", e.target.value)}
              rows={4}
              className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 resize-y outline-none transition-all"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
                background: "var(--color-bg)",
                borderColor: "var(--color-border)",
                fontFamily: "inherit",
                minHeight: 100,
              }}
            />
          </Field>

          <Field label="Посилання на обкладинку (запасне)">
            <TextInput
              type="url"
              value={form.coverUrl}
              onChange={(v) => patch("coverUrl", v)}
              placeholder="https://…"
            />
            <small
              className="block mt-1"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
            >
              Використовується, якщо файл обкладинки не завантажено.
            </small>
          </Field>

          <Field label="Файл обкладинки">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-[var(--radius-sm)] border border-dashed px-3 py-2 cursor-pointer"
              style={{
                fontSize: "var(--text-sm)",
                background: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            />
          </Field>

          <div className="flex gap-2.5 mt-2">
            <Button type="submit" variant="accent" loading={loading}>
              Додати книгу
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/${locale}`)}
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
