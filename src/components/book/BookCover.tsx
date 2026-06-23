import Image from "next/image";
import {useTranslations} from "next-intl";
import styles from "./BookCover.module.css";

interface BookCoverProps {
    src: string | null;
    title: string;
    width?: number;
    height?: number;
}

export function BookCover({src, title, width = 200, height = 300}: BookCoverProps) {
    const t = useTranslations("book");

    return (
        <div className={styles.wrap} style={{width, height}}>
            {src ? (
                <Image
                    src={src}
                    alt={t("coverAlt", {title})}
                    fill
                    sizes={`${width}px`}
                    className={styles.image}
                />
            ) : (
                <div className={styles.noCover}>{title}</div>
            )}
            <div aria-hidden className={styles.spine}/>
        </div>
    );
}