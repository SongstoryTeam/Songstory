"use client";

import { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, BadgeCheck, XCircle, CheckCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import axiosInstance from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface NotificationItem {
  id: number;
  type: string;
  typeDisplay: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  like_music: <Heart size={16} />,
  comment_reply: <MessageCircle size={16} />,
  verification_approved: <BadgeCheck size={16} />,
  verification_rejected: <XCircle size={16} />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await axiosInstance.get<{
          notifications: NotificationItem[];
          unread_count: number;
        }>(ENDPOINTS.notifications.list);
        if (!cancelled) setNotifications(data.notifications);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function markRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    await axiosInstance.post(ENDPOINTS.notifications.markRead(id));
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await axiosInstance.post(ENDPOINTS.notifications.markAllRead);
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="px-9 py-9 max-w-2xl">
      <div className="flex items-center justify-between mb-7">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            color: "var(--color-ink)",
          }}
        >
          Сповіщення
        </h1>
        {hasUnread && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            <CheckCheck size={13} />
            Прочитати всі
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
          Завантаження…
        </p>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={22} />}
          title="Сповіщень немає"
          description="Тут з'являтимуться лайки, відповіді на коментарі та статус верифікації автора."
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.isRead && markRead(n.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border text-left transition-colors"
              style={{
                background: n.isRead ? "var(--color-surface)" : "var(--color-accent-lt)",
                borderColor: "var(--color-border)",
              }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
                style={{
                  background: n.isRead ? "var(--color-bg)" : "var(--color-surface)",
                  color: "var(--color-accent)",
                }}
              >
                {TYPE_ICONS[n.type] ?? <Bell size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-ink)",
                  }}
                >
                  {n.typeDisplay}
                </p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
                  {formatRelative(n.createdAt)}
                </p>
              </div>
              {!n.isRead && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "var(--color-accent)" }}
                  aria-label="Непрочитано"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}хв тому`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}год тому`;
  return `${Math.floor(h / 24)}д тому`;
}
