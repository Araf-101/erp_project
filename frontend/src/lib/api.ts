import { getAuthToken } from "@/lib/auth";

export function getApiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  return base.replace(/\/$/, "");
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${getApiBaseUrl()}${normalizePath(path)}`;
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (
    init?.body !== undefined &&
    init?.body !== null &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      const msg = parsed.message;
      const err = parsed.error;
      if (typeof msg === "string") message = msg;
      else if (typeof err === "string") message = err;
      else if (Array.isArray(msg)) message = msg.join(", ");
    } catch {
      /* use raw text */
    }
    throw new Error(message || `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await res.json()) as T;
  }

  return undefined as T;
}

export function unwrapList<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === "object" && "data" in json) {
    const d = (json as { data: unknown }).data;
    if (Array.isArray(d)) return d as T[];
  }
  return [];
}

export function unwrapRecord<T>(json: unknown): T | null {
  if (json == null) return null;
  if (typeof json === "object" && "data" in json) {
    const inner = (json as { data: unknown }).data;
    if (inner && typeof inner === "object") return inner as T;
  }
  if (typeof json === "object") return json as T;
  return null;
}

export function extractToken(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const direct =
    o.token ?? o.access_token ?? o.plainTextToken;
  if (typeof direct === "string") return direct;
  const inner = o.data;
  if (inner && typeof inner === "object") {
    const t = (inner as Record<string, unknown>).token;
    if (typeof t === "string") return t;
  }
  return null;
}
