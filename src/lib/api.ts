/** Small typed fetch helpers for the serverless API. */

export type ApiOk<T> = { ok: true; status: number; data: T };
export type ApiFail = {
  ok: false;
  status: number;
  error: string;
  code?: string;
  fieldErrors?: Record<string, string>;
};
export type ApiResult<T> = ApiOk<T> | ApiFail;

const TIMEOUT_MS = 15000;

async function request<T>(url: string, init: RequestInit): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal, headers: { Accept: "application/json", ...init.headers } });
    let body: Record<string, unknown> = {};
    try {
      body = (await res.json()) as Record<string, unknown>;
    } catch {
      body = {};
    }

    if (res.ok) {
      return { ok: true, status: res.status, data: body as T };
    }

    return {
      ok: false,
      status: res.status,
      error: typeof body.error === "string" ? body.error : "Something went wrong. Please try again.",
      code: typeof body.code === "string" ? body.code : undefined,
      fieldErrors: (body.fieldErrors as Record<string, string> | undefined) ?? undefined,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "We could not reach the server. Please check your connection and try again.",
      code: "network",
    };
  } finally {
    window.clearTimeout(timer);
  }
}

export function getJson<T>(url: string, headers?: Record<string, string>): Promise<ApiResult<T>> {
  return request<T>(url, { method: "GET", headers });
}

export function sendJson<T>(
  url: string,
  method: "POST" | "PATCH",
  body: unknown,
  headers?: Record<string, string>,
): Promise<ApiResult<T>> {
  return request<T>(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
