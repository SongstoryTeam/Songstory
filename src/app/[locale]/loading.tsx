export default function Loading() {
  return (
    <div className="px-9 py-9">
      <div
        className="h-8 w-48 rounded-md mb-6 animate-pulse"
        style={{ background: "var(--color-border)" }}
      />
      <div
        className="grid gap-x-5 gap-y-7"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div
              className="w-full rounded-[var(--radius-sm)] animate-pulse"
              style={{ aspectRatio: "2/3", background: "var(--color-border)" }}
            />
            <div
              className="h-3 rounded animate-pulse"
              style={{ background: "var(--color-border)", width: "80%" }}
            />
            <div
              className="h-2.5 rounded animate-pulse"
              style={{ background: "var(--color-border)", width: "55%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
