import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { playfair, dmSans } from "@/lib/fonts";
import { AppShell } from "@/components/layout/AppShell";
import "@/app/globals.css";

const LOCALES = ["uk", "en"] as const;

export const metadata: Metadata = {
  title: {
    default: "Songstory — Музика до кожного розділу книги",
    template: "%s — Songstory",
  },
  description:
    "Знаходь музичні рекомендації до кожного розділу улюбленої книги. Спільнота підбирає треки, що передають настрій — розділ за розділом.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex"
        style={{ background: "var(--color-bg)" }}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <AppShell locale={locale}>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
