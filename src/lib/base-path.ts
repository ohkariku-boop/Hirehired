/** GitHub Pages project site lives under /Hirehired */
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/Hirehired" : "";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
