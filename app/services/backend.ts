const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonPrimitive[] | { [key: string]: JsonValue };

type BodyInput = JsonValue | FormData | BodyInit | undefined;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInput;
};

export class ApiError extends Error {
  status: number;
  statusText: string;
  data: unknown;

  constructor(status: number, statusText: string, data: unknown) {
    super(`Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

function resolveUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const base = API_BASE_URL || origin;
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${safePath}`;
}

function normaliseBody(body: BodyInput, headers: Headers): BodyInit | undefined {
  if (body == null) {
    return undefined;
  }

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return JSON.stringify(body);
}

async function request<TResponse = unknown>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const url = resolveUrl(path);
  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const body = normaliseBody(options.body, headers);

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (response.status === 204 || response.status === 205) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? await response.json().catch(() => undefined)
    : await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, payload);
  }

  return payload as TResponse;
}

function query(options?: RequestOptions): RequestOptions {
  return { credentials: "include", ...options };
}

export const backendService = {
  get<TResponse = unknown>(path: string, options?: RequestOptions) {
    return request<TResponse>(path, { ...query(options), method: "GET" });
  },

  post<TResponse = unknown>(path: string, body?: BodyInput, options?: RequestOptions) {
    return request<TResponse>(path, { ...query(options), method: "POST", body });
  },

  put<TResponse = unknown>(path: string, body?: BodyInput, options?: RequestOptions) {
    return request<TResponse>(path, { ...query(options), method: "PUT", body });
  },

  patch<TResponse = unknown>(path: string, body?: BodyInput, options?: RequestOptions) {
    return request<TResponse>(path, { ...query(options), method: "PATCH", body });
  },

  delete<TResponse = unknown>(path: string, options?: RequestOptions) {
    return request<TResponse>(path, { ...query(options), method: "DELETE" });
  },

  request,
};

export type { RequestOptions };
