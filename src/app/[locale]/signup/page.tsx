"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { authService } from "@/lib/api/services/playlists.service";
import { useAuthStore } from "@/store/auth.store";

type Props = { params: Promise<{ locale: string }> };

export default function SignupPage({ params }: Props) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function patch(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const tokens = await authService.register(form);
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
      setError("Не вдалось зареєструватись. Можливо, такий username вже існує.");
    } finally {
      setLoading(false);
    }
  }

  const fields: Array<{
    key: keyof typeof form;
    label: string;
    type: string;
    required?: boolean;
    autoComplete?: string;
  }> = [
    { key: "username", label: "Username *", type: "text", required: true, autoComplete: "username" },
    { key: "email", label: "Email *", type: "email", required: true, autoComplete: "email" },
    { key: "firstName", label: "Ім'я", type: "text", autoComplete: "given-name" },
    { key: "lastName", label: "Прізвище", type: "text", autoComplete: "family-name" },
    { key: "password", label: "Пароль *", type: "password", required: true, autoComplete: "new-password" },
  ];

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
          Приєднатись
        </h1>
        <p
          className="mb-7"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          Створіть безкоштовний акаунт і починайте ділитись музикою
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
          {fields.map((f) => (
            <div key={f.key}>
              <label
                className="block mb-1.5 font-medium"
                style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => patch(f.key, e.target.value)}
                autoComplete={f.autoComplete}
                required={f.required}
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
          ))}

          <div className="mt-2">
            <Button
              type="submit"
              variant="accent"
              loading={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Створити акаунт
            </Button>
          </div>
        </form>

        <p
          className="text-center mt-5"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
        >
          Вже є акаунт?{" "}
          <Link
            href="/login"
            style={{ color: "var(--color-accent)", fontWeight: 500 }}
          >
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
