/**
 * Minimal Supabase REST (PostgREST) client. Uses the service role key, which must
 * only ever be read on the server. It is never bundled into the frontend.
 */
export interface SupabaseConfig {
  url: string;
  key: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

export interface SupabaseResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

export async function supabaseRequest<T = unknown>(
  config: SupabaseConfig,
  pathAndQuery: string,
  init: { method?: "GET" | "POST" | "PATCH"; body?: unknown; prefer?: string } = {},
): Promise<SupabaseResult<T>> {
  const res = await fetch(`${config.url}/rest/v1/${pathAndQuery}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  const text = await res.text();
  let data: T | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }
  return { ok: res.ok, status: res.status, data };
}
