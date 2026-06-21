import Link from "next/link";
import {BookMarked, Compass, Headphones, Share2} from "lucide-react";
import {BookCard} from "@/components/book/BookCard";
import {serverFetch} from "@/lib/api/server-fetch";
import type {Book} from "@/types";
import styles from "./page.module.css";

interface BookListResponse {
    results: Book[];
    count: number;
}

async function getBooks(filters: { search: string; genre: string; sort: string }): Promise<Book[]> {
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

export default async function HomePage({params, searchParams}: Props) {
    const {locale} = await params;
    const {search = "", genre = "", sort = "newest"} = await searchParams;
    const books = await getBooks({search, genre, sort});
    const showHero = !search && !genre;

    return (
        <>
            {showHero && <Hero locale={locale}/>}
            {showHero && <HowItWorks/>}

            <section className={styles.catalog} id="catalog">
                <div className={styles.catalogHeader}>
                    <div>
                        <p className={styles.catalogEyebrow}>
                            {books.length} {pluralizeBooks(books.length)}
                        </p>
                        <h2 className={styles.catalogTitle}>{search ? `Результати: «${search}»` : genre || "Усі книги"}</h2>
                    </div>
                    <Link href={`/${locale}/book/create`} className={styles.addBookLink}>
                        <BookMarked size={14}/>
                        Додати книгу
                    </Link>
                </div>

                {books.length > 0 ? (
                    <div className={styles.grid}>
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} locale={locale}/>
                        ))}
                    </div>
                ) : (
                    <CatalogEmptyState locale={locale} search={search} genre={genre}/>
                )}
            </section>
        </>
    );
}

function pluralizeBooks(count: number): string {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "книга";
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "книги";
    return "книг";
}

function Hero({locale}: { locale: string }) {
    return (
        <section className={styles.hero}>
            <div className={styles.heroGlow} aria-hidden/>
            <div className={styles.heroGlowSecondary} aria-hidden/>

            <p className={styles.heroEyebrow}>Книги та музика</p>

            <h1 className={styles.heroTitle}>
                Музичні рекомендації
                <br/>
                до кожного розділу
            </h1>

            <p className={styles.heroSubtitle}>
                Спільнота підбирає треки, що передають настрій книги — розділ за розділом.
            </p>

            <div className={styles.heroActions}>
                <a href="#catalog" className={styles.heroPrimaryAction}>
                    Переглянути книги
                </a>
                <Link href={`/${locale}/signup`} className={styles.heroSecondaryAction}>
                    Приєднатись
                </Link>
            </div>
        </section>
    );
}

const HOW_STEPS = [
    {icon: <Compass size={18}/>, label: "Обери книгу", desc: "Перегляньте каталог або додайте свою"},
    {icon: <Headphones size={18}/>, label: "Відкрий розділ", desc: "Кожен розділ має власний саундтрек"},
    {icon: <Share2 size={18}/>, label: "Слухай і ділися", desc: "Лайкай треки або додавай власні"},
];

function HowItWorks() {
    return (
        <div className={styles.howItWorks}>
            {HOW_STEPS.map((step, i) => (
                <div key={step.label} className={styles.howStep}>
                    <span className={styles.howIcon}>{step.icon}</span>
                    <div>
                        <span className={styles.howIndex}>{`Крок ${String(i + 1).padStart(2, "0")}`}</span>
                        <p className={styles.howLabel}>{step.label}</p>
                        <p className={styles.howDesc}>{step.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CatalogEmptyState({locale, search, genre}: { locale: string; search: string; genre: string }) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <p className={styles.emptyTitle}>Книг не знайдено</p>
            <p className={styles.emptyDescription}>
                {search
                    ? "Нічого не збіглось із запитом. Спробуйте інший заголовок або автора."
                    : genre
                        ? `У жанрі «${genre}» ще немає книг.`
                        : "Каталог порожній. Додайте першу книгу!"}
            </p>
            <Link href={`/${locale}/book/create`} className={styles.emptyAction}>
                Додати книгу
            </Link>
        </div>
    );
}