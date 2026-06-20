"use client";

import {forwardRef} from "react";
import {motion} from "framer-motion";

type Variant = "primary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: React.ReactNode;
}

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
    primary: {
        background: "var(--color-ink)",
        color: "#fff",
    },
    accent: {
        background: "var(--color-accent)",
        color: "#fff",
        boxShadow: "0 2px 8px rgb(196 98 45 / 0.3)",
    },
    ghost: {
        background: "transparent",
        color: "var(--color-muted)",
        border: "1px solid var(--color-border)",
    },
    danger: {
        background: "transparent",
        color: "var(--color-danger)",
        border: "1px solid rgb(192 57 43 / 0.25)",
    },
};

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
    sm: {padding: "6px 14px", fontSize: "var(--text-xs)"},
    md: {padding: "9px 18px", fontSize: "var(--text-sm)"},
    lg: {padding: "12px 28px", fontSize: "var(--text-base)"},
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            loading = false,
            icon,
            children,
            disabled,
            style,
            ...rest
        },
        ref,
    ) => {
        const isDisabled = disabled || loading;

        return (
            <motion.button
                ref={ref}
                whileHover={isDisabled ? {} : {translateY: -1}}
                whileTap={isDisabled ? {} : {scale: 0.97}}
                transition={{duration: 0.15}}
                disabled={isDisabled}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: "100px",
                    fontWeight: 500,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.55 : 1,
                    border: "none",
                    transition: "background 150ms ease, box-shadow 150ms ease",
                    ...VARIANT_STYLES[variant],
                    ...SIZE_STYLES[size],
                    ...style,
                }}
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
        <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            className="animate-spin"
        >
            <circle
                cx="6.5"
                cy="6.5"
                r="5"
                stroke="currentColor"
                strokeWidth="2"
                strokeOpacity="0.3"
            />
            <path
                d="M11.5 6.5a5 5 0 0 0-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
