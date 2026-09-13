/** GitHub Pages project base path */
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/Hirehired" : "";

export function asset(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}
