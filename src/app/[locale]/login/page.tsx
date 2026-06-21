"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { authService } from "@/lib/api/services/playlists.service";
import { useAuthStore } from "@/store/auth.store";

type Props = { params: Promise<{ locale: string }> };

export default function LoginPage({ params }: Props) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const tokens = await authService.login({ username, password });
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      const me = await authService.me();
      setAuth(
        {
          id: me.id,
          email: me.email,
          username: me.username,
          firstName: me.first_name,
          lastName: me.last_name,
          isVerifiedAuthor: me.is_verified_author,
        },
        tokens.access,
      );
      const { locale } = await params;
      router.push(`/${locale}`);
    } catch {
      setError("Невірний логін або пароль. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[480px] mx-auto px-5 py-14">
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
          З поверненням
        </h1>
        <p
          className="mb-7"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          Увійдіть до свого акаунту Songstory
        </p>

        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-[var(--radius-sm)] border-l-[3px] text-sm"
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
          <AuthField
            label="Ім'я користувача"
            type="text"
            value={username}
            onChange={setUsername}
            autoComplete="username"
            required
          />
          <AuthField
            label="Пароль"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />
          <div className="mt-2">
            <Button
              type="submit"
              variant="accent"
              loading={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Увійти
            </Button>
          </div>
        </form>

        <p
          className="text-center mt-5"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          Ще немає акаунту?{" "}
          <Link
            href="/signup"
            style={{ color: "var(--color-accent)", fontWeight: 500 }}
          >
            Зареєструватись безкоштовно
          </Link>
        </p>
      </div>
    </div>
  );
}

function AuthField({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="block mb-1.5 font-medium"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
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
    </div>
  );
}
