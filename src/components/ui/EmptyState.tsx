import styles from "./EmptyState.module.css";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({icon, title, description, action}: EmptyStateProps) {
    return (
        <div className={styles.wrap} role="status">
            {icon && (
                <div className={styles.icon} aria-hidden>
                    {icon}
                </div>
            )}
            <p className={styles.title}>{title}</p>
            {description && <p className={styles.description}>{description}</p>}
            {action}
        </div>
    );
}