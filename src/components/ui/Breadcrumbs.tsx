import Link from "next/link";
import {ChevronRight} from "lucide-react";

interface Crumb {
    label: string;
    href?: string;
}

export function Breadcrumbs({crumbs}: { crumbs: Crumb[] }) {
    return (
        <nav
            aria-label="Навігація"
            className="flex items-center gap-1.5 flex-wrap mb-6"
            style={{fontSize: "var(--text-sm)", color: "var(--color-muted)"}}
        >
            {crumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
              <ChevronRight
                  size={13}
                  style={{color: "var(--color-border)", flexShrink: 0}}
                  aria-hidden
              />
          )}
                    {crumb.href ? (
                        <Link
                            href={crumb.href}
                            className="transition-colors hover:text-[var(--color-accent)]"
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span
                            aria-current="page"
                            style={{color: "var(--color-ink)"}}
                        >
              {crumb.label}
            </span>
                    )}
        </span>
            ))}
        </nav>
    );
}
