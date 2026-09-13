/**
 * GitHub Pages project site is always under /Hirehired.
 * NEXT_PUBLIC_BASE_PATH is set in the deploy workflow so the static
 * export bakes the correct prefix into HTML (including <form action>).
 */
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.NODE_ENV === "production" ? "/Hirehired" : "");

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  // Already prefixed
  if (BASE_PATH && path.startsWith(BASE_PATH + "/")) return path;
  return `${BASE_PATH}${path}`;
}
