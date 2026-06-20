"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { musicService, type AddMusicPayload } from "@/lib/api/services/chapters.service";
import { youtubeService, type YouTubeResult } from "@/lib/api/services/youtube.service";
import { useDebouncedCallback } from "@/lib/hooks";

const LINK_TYPES = [
  { value: "youtube", label: "YouTube" },
  { value: "spotify", label: "Spotify" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "other", label: "Інше" },
];

const MOODS = [
  { value: "", label: "— Без настрою —" },
  { value: "epic", label: "Епічний" },
  { value: "sad", label: "Меланхолійний" },
  { value: "calm", label: "Спокійний" },
  { value: "tense", label: "Напружений" },
  { value: "romantic", label: "Романтичний" },
  { value: "dark", label: "Темний" },
  { value: "uplifting", label: "Піднесений" },
  { value: "mysterious", label: "Таємничий" },
];

interface AddMusicPageProps {
  chapterId: number;
  chapterNum: number;
  chapterTitle: string;
  bookSlug: string;
  bookTitle: string;
  locale: string;
}

export function AddMusicForm({
  chapterId,
  chapterNum,
  chapterTitle,
  bookSlug,
  bookTitle,
  locale,
}: AddMusicPageProps) {
  const router = useRouter();
  const [form, setForm] = useState<AddMusicPayload>({
    trackTitle: "",
    artist: "",
    linkType: "youtube",
    linkUrl: "",
    embedCode: "",
    comment: "",
    mood: "",
  });
  const [ytResults, setYtResults] = useState<YouTubeResult[]>([]);
  const [ytLoading, setYtLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchYoutube = useDebouncedCallback(async (query: string) => {
    if (query.length < 3 || form.linkType !== "youtube") {
      setYtResults([]);
      return;
    }
    setYtLoading(true);
    try {
      const results = await youtubeService.search(query);
      setYtResults(results);
    } finally {
      setYtLoading(false);
    }
  }, 400);

  function patch<K extends keyof AddMusicPayload>(key: K, value: AddMusicPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function selectYtResult(result: YouTubeResult) {
    setForm((prev) => ({
      ...prev,
      trackTitle: result.title,
      artist: result.channel,
      embedCode: result.id,
      linkUrl: `https://www.youtube.com/watch?v=${result.id}`,
      linkType: "youtube",
    }));
    setYtResults([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.trackTitle.trim() || !form.linkUrl.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await musicService.add(chapterId, form);
      router.push(`/${locale}/book/${bookSlug}/chapter/${chapterNum}`);
    } catch {
      setError("Не вдалося додати рекомендацію. Перевірте дані та спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  }

  const crumbs = [
    { label: "Каталог", href: `/${locale}` },
    { label: bookTitle, href: `/${locale}/book/${bookSlug}` },
    {
      label: `Розділ ${chapterNum}`,
      href: `/${locale}/book/${bookSlug}/chapter/${chapterNum}`,
    },
    { label: "Додати музику" },
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
          Додати рекомендацію
        </h1>
        <p
          className="mb-7"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          До «{chapterTitle}» — {bookTitle}
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
          {/* Track title + YouTube search */}
          <div className="relative">
            <FieldLabel>Назва треку *</FieldLabel>
            <div className="relative">
              <Input
                value={form.trackTitle}
                onChange={(v) => {
                  patch("trackTitle", v);
                  searchYoutube(v);
                }}
                placeholder="Почніть вводити — пошук на YouTube"
                required
              />
              {ytLoading && (
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-muted)" }}
                >
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
                    <path d="M12 7a5 5 0 0 0-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>

            {/* YouTube results dropdown */}
            {ytResults.length > 0 && (
              <div
                ref={resultsRef}
                className="absolute top-full left-0 right-0 z-50 rounded-[var(--radius-md)] border overflow-hidden mt-1"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {ytResults.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => selectYtResult(r)}
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--color-bg)] border-b last:border-b-0"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.thumbnail}
                      alt=""
                      width={60}
                      height={45}
                      className="rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className="truncate font-medium"
                        style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
                      >
                        {r.title}
                      </p>
                      <p
                        className="truncate"
                        style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
                      >
                        {r.channel}
                      </p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setYtResults([])}
                  className="absolute top-2 right-2"
                  style={{ color: "var(--color-muted)" }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Artist */}
          <div>
            <FieldLabel>Виконавець *</FieldLabel>
            <Input
              value={form.artist}
              onChange={(v) => patch("artist", v)}
              placeholder="Ім'я виконавця або гурту"
              required
            />
          </div>

          {/* Platform */}
          <div>
            <FieldLabel>Платформа</FieldLabel>
            <Select
              value={form.linkType}
              options={LINK_TYPES}
              onChange={(v) => patch("linkType", v)}
            />
          </div>

          {/* URL */}
          <div>
            <FieldLabel>Посилання *</FieldLabel>
            <Input
              value={form.linkUrl}
              onChange={(v) => patch("linkUrl", v)}
              placeholder="https://…"
              type="url"
              required
            />
          </div>

          {/* Embed code — auto-filled for YouTube */}
          <div>
            <FieldLabel>
              Embed / ID відео
              <span
                className="ml-1.5"
                style={{ fontSize: "11px", fontWeight: 400, color: "var(--color-muted)" }}
              >
                (заповнюється автоматично після вибору з пошуку)
              </span>
            </FieldLabel>
            <Input
              value={form.embedCode ?? ""}
              onChange={(v) => patch("embedCode", v)}
              placeholder="dQw4w9WgXcQ"
              readOnly={form.linkType === "youtube" && !!form.embedCode}
            />
          </div>

          {/* Mood */}
          <div>
            <FieldLabel>Настрій</FieldLabel>
            <Select
              value={form.mood ?? ""}
              options={MOODS}
              onChange={(v) => patch("mood", v)}
            />
          </div>

          {/* Comment */}
          <div>
            <FieldLabel>Чому цей трек підходить</FieldLabel>
            <textarea
              value={form.comment ?? ""}
              onChange={(e) => patch("comment", e.target.value)}
              placeholder="Розкажіть, яку атмосферу передає трек…"
              rows={3}
              className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 resize-y outline-none transition-all"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-ink)",
                background: "var(--color-bg)",
                borderColor: "var(--color-border)",
                fontFamily: "inherit",
                minHeight: 90,
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 mt-2">
            <Button type="submit" variant="accent" loading={submitting}>
              Додати рекомендацію
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                router.push(
                  `/${locale}/book/${bookSlug}/chapter/${chapterNum}`,
                )
              }
            >
              Скасувати
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Shared field primitives ────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-1.5 font-medium"
      style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
    >
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 outline-none transition-all"
      style={{
        fontSize: "var(--text-sm)",
        color: "var(--color-ink)",
        background: readOnly ? "var(--color-bg)" : "var(--color-bg)",
        borderColor: "var(--color-border)",
        opacity: readOnly ? 0.7 : 1,
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
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 outline-none transition-all appearance-none"
      style={{
        fontSize: "var(--text-sm)",
        color: "var(--color-ink)",
        background: "var(--color-bg)",
        borderColor: "var(--color-border)",
        fontFamily: "inherit",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
