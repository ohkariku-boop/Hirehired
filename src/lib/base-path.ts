/**
 * Base path for assets/links.
 * - Vercel / custom domain: leave unset ("").
 * - GitHub Pages project site: set NEXT_PUBLIC_BASE_PATH=/Hirehired
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  if (BASE_PATH && path.startsWith(BASE_PATH + "/")) return path;
  return `${BASE_PATH}${path}`;
}

/** Alias for static assets (logo, favicon, etc.) */
export function asset(path: string): string {
  return withBase(path);
}
