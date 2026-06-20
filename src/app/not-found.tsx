import Link from "next/link";

export default function NotFound() {
    return (
        <html lang="uk">
        <body
            suppressHydrationWarning
            style={{
                margin: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 36px",
                textAlign: "center",
                background: "#F7F4EF",
                fontFamily: "system-ui, sans-serif",
            }}
        >
        <p
            style={{
                fontFamily: "Georgia, serif",
                fontSize: 80,
                fontWeight: 600,
                color: "#E2DDD6",
                lineHeight: 1,
                marginBottom: 16,
            }}
        >
            404
        </p>
        <h1
            style={{
                fontFamily: "Georgia, serif",
                fontSize: 26,
                fontWeight: 600,
                color: "#1A1612",
                marginBottom: 10,
            }}
        >
            Сторінку не знайдено
        </h1>
        <p
            style={{
                fontSize: 15,
                color: "#7A7167",
                maxWidth: 360,
                marginBottom: 32,
            }}
        >
            Схоже, ця сторінка зникла. Можливо, вона ніколи не існувала або була переміщена.
        </p>
        <Link
            href="/"
            style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 100,
                background: "#C4622D",
                color: "#fff",
                fontWeight: 500,
                fontSize: 14,
                textDecoration: "none",
            }}
        >
            До каталогу
        </Link>
        </body>
        </html>
    );
}