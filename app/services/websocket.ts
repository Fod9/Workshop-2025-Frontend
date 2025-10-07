const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

function resolveBaseForWs(): string {
  if (typeof window === "undefined") return "";
  const fallback = `ws://${window.location.host}`;
  try {
    const base = API_BASE_URL || window.location.origin;
    const url = new URL(base);
    return `ws://${url.host}`;
  } catch {
    return fallback;
  }
}

export function resolveWebSocketUrl(path: string): string {
  if (/^wss?:\/\//i.test(path)) return path;
  const base = resolveBaseForWs();
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${safePath}`;
}
