import Image from "next/image";

interface BookCoverProps {
  src: string | null;
  title: string;
  width?: number;
  height?: number;
}

export function BookCover({
  src,
  title,
  width = 200,
  height = 300,
}: BookCoverProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        boxShadow:
          "6px 8px 20px rgb(26 22 18 / 0.2), inset -3px 0 8px rgb(0 0 0 / 0.08)",
        background: "var(--color-border)",
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={`Обкладинка «${title}»`}
          fill
          sizes={`${width}px`}
          className="object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center p-5 text-center leading-snug"
          style={{
            background: "linear-gradient(145deg, #E8E0D5, #D4C9BC)",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
          }}
        >
          {title}
        </div>
      )}

      {/* Spine shadow */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-4 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgb(0 0 0 / 0.1))",
        }}
      />
    </div>
  );
}
