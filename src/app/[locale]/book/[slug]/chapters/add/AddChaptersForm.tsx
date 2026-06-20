"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { chaptersService } from "@/lib/api/services/chapters.service";

interface Props {
  bookId: number;
  bookSlug: string;
  bookTitle: string;
  locale: string;
}

export function AddChaptersForm({ bookId, bookSlug, bookTitle, locale }: Props) {
  const router = useRouter();
  const [count, setCount] = useState(10);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (count < 1 || count > 100) return;
    setLoading(true);
    setError("");
    try {
      await chaptersService.addBulk(bookId, count);
      router.push(`/${locale}/book/${bookSlug}`);
    } catch {
      setError("Не вдалося додати розділи. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: bookTitle, href: `/${locale}/book/${bookSlug}` },
    { label: "Додати розділи" },
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
          Додати розділи
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
          <div>
            <label
              className="block mb-1.5 font-medium"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
            >
              Кількість розділів
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 outline-none transition-all"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
                background: "var(--color-bg)",
                borderColor: "var(--color-border)",
              }}
            />
            <small
              className="block mt-1"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
            >
              Нумерація починається автоматично від останнього існуючого розділу.
            </small>
          </div>

          <div className="flex gap-2.5 mt-2">
            <Button type="submit" variant="accent" loading={loading}>
              Додати
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
