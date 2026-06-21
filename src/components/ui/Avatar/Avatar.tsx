import styles from "./Avatar.module.css";

interface AvatarProps {
    name: string;
    size?: number;
}

export function Avatar({name, size = 32}: AvatarProps) {
    const initial = name[0]?.toUpperCase() ?? "?";

    return (
        <div aria-hidden className={styles.avatar} style={{width: size, height: size, fontSize: size * 0.4}}>
            {initial}
        </div>
    );
}