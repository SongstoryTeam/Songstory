"use client";

import {forwardRef} from "react";
import {motion} from "framer-motion";
import {cx} from "@/lib/cx";
import styles from "./Button.module.css";

type Variant = "primary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {variant = "primary", size = "md", loading = false, icon, children, disabled, className, ...rest},
        ref,
    ) => {
        const isDisabled = disabled || loading;

        return (
            <motion.button
                ref={ref}
                whileHover={isDisabled ? undefined : {translateY: -1}}
                whileTap={isDisabled ? undefined : {scale: 0.97}}
                transition={{duration: 0.15}}
                disabled={isDisabled}
                className={cx(styles.button, styles[variant], styles[size], className)}
                {...(rest as React.ComponentProps<typeof motion.button>)}
            >
                {loading ? <Spinner/> : icon}
                {children}
            </motion.button>
        );
    },
);

Button.displayName = "Button";

function Spinner() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={styles.spinner}>
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
            <path d="M11.5 6.5a5 5 0 0 0-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}