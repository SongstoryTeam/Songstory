const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface ServerFetchOptions {
  revalidate?: number;
  tags?: string[];
}

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: {
        revalidate: options.revalidate ?? 60,
        tags: options.tags,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
