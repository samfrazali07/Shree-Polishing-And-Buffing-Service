import { timingSafeEqual } from "node:crypto";

/** Minimal request/response shapes that are compatible with Vercel's Node.js functions. */
export interface ApiRequest {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

export interface ApiResponse {
  setHeader(name: string, value: string): unknown;
  status(code: number): ApiResponse;
  json(body: unknown): unknown;
}

export type ApiHandler = (req: ApiRequest, res: ApiResponse) => Promise<unknown>;

export function parseBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as unknown;
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  if (body && typeof body === "object") return body as Record<string, unknown>;
  return {};
}

export function getQueryParam(req: ApiRequest, key: string): string {
  const value = req.query?.[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return typeof value === "string" ? value : "";
}

export function bearerToken(headers: ApiRequest["headers"]): string | null {
  const raw = headers.authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const match = /^Bearer\s+(.+)$/i.exec(value.trim());
  return match ? match[1].trim() : null;
}

/** Constant-time string comparison for secrets. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
