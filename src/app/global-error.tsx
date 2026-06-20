"use client";

export default function GlobalError({
                                        reset,
                                    }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
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
            500
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
            Щось пішло не так
        </h1>
        <p
            style={{
                fontSize: 15,
                color: "#7A7167",
                maxWidth: 360,
                marginBottom: 32,
            }}
        >
            На нашому боці сталася непередбачена помилка. Спробуйте оновити сторінку або повернутись пізніше.
        </p>
        <button
            onClick={reset}
            style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 100,
                background: "#C4622D",
                color: "#fff",
                fontWeight: 500,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
            }}
        >
            Спробувати ще раз
        </button>
        </body>
        </html>
    );
}