import { BookCard } from "@/components/book/BookCard";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Book } from "@/types";

interface BookListResponse {
  results: Book[];
  count: number;
}

async function getBooks(
  _locale: string,
  filters: { search: string; genre: string; sort: string },
): Promise<Book[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.genre) params.set("genre", filters.genre);
  if (filters.sort) params.set("sort", filters.sort);

  const data = await serverFetch<BookListResponse>(`/books/?${params.toString()}`, {
    revalidate: 30,
    tags: ["books"],
  });
  return data?.results ?? [];
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; genre?: string; sort?: string; page?: string }>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { search = "", genre = "", sort = "newest" } = await searchParams;
  const books = await getBooks(locale, { search, genre, sort });

  return (
    <>
      {/* Hero */}
      {!search && !genre && (
        <section
          className="relative overflow-hidden px-9 pt-14 pb-11"
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: -60,
              right: -40,
              width: 320,
              height: 320,
              background:
                "radial-gradient(circle, rgb(196 98 45 / 0.06) 0%, transparent 70%)",
            }}
          />

          <p
            className="uppercase tracking-widest mb-5 inline-block pb-1"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--color-muted)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            Книги та музика
          </p>

          <h1
            className="leading-tight mb-4 max-w-lg"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 4.5vw, 3rem)",
              fontWeight: 600,
              letterSpacing: "-0.5px",
              color: "var(--color-ink)",
            }}
          >
            Музичні рекомендації
            <br />
            до кожного розділу
          </h1>

          <p
            className="max-w-md mb-7 leading-relaxed"
            style={{ fontSize: "var(--text-base)", color: "var(--color-muted)" }}
          >
            Спільнота підбирає треки, що передають настрій книги — розділ за
            розділом.
          </p>

          <div className="flex gap-3 flex-wrap">
            <a
              href="#catalog"
              className="flex items-center px-7 py-3 rounded-full font-medium transition-all hover:-translate-y-px"
              style={{
                fontSize: "var(--text-base)",
                background: "var(--color-accent)",
                color: "#fff",
                boxShadow: "0 2px 8px rgb(196 98 45 / 0.3)",
              }}
            >
              Переглянути книги
            </a>
            <a
              href={`/${locale}/signup`}
              className="flex items-center px-7 py-3 rounded-full border font-medium transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              style={{
                fontSize: "var(--text-base)",
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              Приєднатись
            </a>
          </div>
        </section>
      )}

      {/* How it works strip */}
      {!search && !genre && (
        <div
          className="flex overflow-hidden"
          style={{
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-bg)",
          }}
        >
          {HOW_STEPS.map((step, i) => (
            <div
              key={i}
              className="flex-1 flex items-start gap-3.5 px-6 py-5"
              style={{
                borderRight:
                  i < HOW_STEPS.length - 1
                    ? "1px solid var(--color-border)"
                    : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 400,
                  color: "var(--color-border)",
                  letterSpacing: "-1px",
                  lineHeight: 1.2,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p
                  className="font-medium mb-0.5"
                  style={{ fontSize: "var(--text-sm)", color: "var(--color-ink)" }}
                >
                  {step.label}
                </p>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Catalog */}
      <section className="px-9 py-9" id="catalog">
        <div className="flex items-baseline justify-between mb-6">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            {search ? `Результати: «${search}»` : genre || "Усі книги"}
          </h2>
          <a
            href={`/${locale}/book/create`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            + Додати книгу
          </a>
        </div>

        {books.length > 0 ? (
          <div
            className="grid gap-x-5 gap-y-7"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            }}
          >
            {books.map((book) => (
              <BookCard key={book.id} book={book} locale={locale} />
            ))}
          </div>
        ) : (
          <EmptyState locale={locale} search={search} genre={genre} />
        )}
      </section>
    </>
  );
}

const HOW_STEPS = [
  {
    label: "Обери книгу",
    desc: "Перегляньте каталог або додайте свою",
  },
  {
    label: "Відкрий розділ",
    desc: "Кожен розділ має власний саундтрек",
  },
  {
    label: "Слухай і ділися",
    desc: "Лайкай треки або додавай власні",
  },
];

function EmptyState({
  locale,
  search,
  genre,
}: {
  locale: string;
  search: string;
  genre: string;
}) {
  return (
    <div
      className="flex flex-col items-center text-center py-16 px-6 rounded-[var(--radius-md)] border border-dashed"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div
        className="flex items-center justify-center w-14 h-14 rounded-full mb-4"
        style={{ background: "var(--color-bg)" }}
      >
        <span style={{ fontSize: "28px" }}>📚</span>
      </div>
      <p
        className="font-medium mb-1.5"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lg)",
          color: "var(--color-ink)",
        }}
      >
        Книг не знайдено
      </p>
      <p
        className="mb-5 max-w-xs"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
      >
        {search
          ? "Нічого не збіглось із запитом. Спробуйте інший заголовок або автора."
          : genre
            ? `У жанрі «${genre}» ще немає книг.`
            : "Каталог порожній. Додайте першу книгу!"}
      </p>
      <a
        href={`/${locale}/book/create`}
        className="px-6 py-2.5 rounded-full font-medium transition-all hover:-translate-y-px"
        style={{
          fontSize: "var(--text-sm)",
          background: "var(--color-accent)",
          color: "#fff",
        }}
      >
        Додати книгу
      </a>
    </div>
  );
}
