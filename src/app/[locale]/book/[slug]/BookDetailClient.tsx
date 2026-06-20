"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, ListMusic } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { booksService } from "@/lib/api/services/books.service";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  book: { id: number; slug: string; averageRating: number };
  locale: string;
}

export function BookDetailClient({ book, locale }: Props) {
  const { isAuthenticated } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [savingLoading, setSavingLoading] = useState(false);

  async function handleSave() {
    if (!isAuthenticated) {
      window.location.href = `/${locale}/login`;
      return;
    }
    setSavingLoading(true);
    try {
      const { saved: newState } = await booksService.save(book.id);
      setSaved(newState);
    } finally {
      setSavingLoading(false);
    }
  }

  async function handleRate(score: number) {
    if (!isAuthenticated) return;
    setUserRating(score);
    await booksService.rate(book.id, score);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex gap-2.5 flex-wrap">
        <Button
          variant="accent"
          size="sm"
          icon={saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          onClick={handleSave}
          loading={savingLoading}
        >
          {saved ? "Збережено" : "Зберегти"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={<ListMusic size={14} />}
          onClick={() => {
            window.location.href = `/${locale}/book/${book.slug}/playlist/create`;
          }}
        >
          Плейліст
        </Button>
      </div>

      {/* Star rating */}
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          <StarRating value={userRating} onChange={handleRate} size={20} />
          <span
            style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}
          >
            {userRating > 0
              ? `Ваша оцінка: ${userRating}/5`
              : book.averageRating > 0
                ? `Середня: ${book.averageRating}`
                : "Оцінити книгу"}
          </span>
        </div>
      )}
    </div>
  );
}
