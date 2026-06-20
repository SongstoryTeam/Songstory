interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({icon, title, description, action}: EmptyStateProps) {
    return (
        <div
            className="flex flex-col items-center text-center py-14 px-6 rounded-[var(--radius-md)] border border-dashed"
            style={{borderColor: "var(--color-border)"}}
        >
            {icon && (
                <div
                    className="flex items-center justify-center w-14 h-14 rounded-full mb-4"
                    style={{background: "var(--color-bg)", color: "var(--color-muted)"}}
                >
                    {icon}
                </div>
            )}
            <p
                className="font-semibold mb-1.5"
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-ink)",
                }}
            >
                {title}
            </p>
            {description && (
                <p
                    className="mb-5 max-w-xs leading-relaxed"
                    style={{fontSize: "var(--text-sm)", color: "var(--color-muted)"}}
                >
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
