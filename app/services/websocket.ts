const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

function resolveBaseForWs(): string {
  if (typeof window === "undefined") return "";
  
  // Utiliser la variable d'environnement WS en priorité
  if (WS_BASE_URL) {
    return WS_BASE_URL;
  }
  
  // Fallback automatique basé sur l'API URL
  const fallback = `ws://${window.location.host}`;
  try {
    const base = API_BASE_URL || window.location.origin;
    const url = new URL(base);
    // Utiliser wss:// si l'API est en https://
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}`;
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

