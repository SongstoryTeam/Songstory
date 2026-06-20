interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 32 }: AvatarProps) {
  const initial = name[0]?.toUpperCase() ?? "?";

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--color-accent)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 500,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {initial}
    </div>
  );
}
