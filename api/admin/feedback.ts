import { bearerToken, getQueryParam, parseBody, safeEqual, type ApiHandler } from "../../server/lib/http";
import { getSupabaseConfig, supabaseRequest } from "../../server/lib/supabase";

/**
 * Moderation API for website feedback. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
 *
 * GET   /api/admin/feedback?status=pending|approved|rejected|hidden|all&rating=1-5
 * PATCH /api/admin/feedback   { id, status: "pending" | "approved" | "rejected" | "hidden" }
 *
 * Only "approved" feedback with publish permission is shown publicly.
 */

const STATUSES = ["pending", "approved", "rejected", "hidden"] as const;
type Status = (typeof STATUSES)[number];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const handler: ApiHandler = async (req, res) => {
  const expected = process.env.ADMIN_TOKEN?.trim();
  if (!expected) {
    return res.status(503).json({ error: "Admin access is not configured (ADMIN_TOKEN is missing).", code: "not_configured" });
  }

  const token = bearerToken(req.headers);
  if (!token || !safeEqual(token, expected)) {
    return res.status(401).json({ error: "Unauthorised." });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return res.status(503).json({ error: "Feedback storage is not configured.", code: "not_configured" });
  }

  if (req.method === "GET") {
    const statusParam = getQueryParam(req, "status") || "pending";
    const ratingParam = Number(getQueryParam(req, "rating"));

    let query =
      "feedback?select=id,full_name,email,company_name,service_used,rating,message,permission_to_publish,status,created_at" +
      "&order=created_at.desc&limit=200";

    if (statusParam !== "all") {
      if (!(STATUSES as readonly string[]).includes(statusParam)) {
        return res.status(400).json({ error: "Invalid status filter." });
      }
      query += `&status=eq.${statusParam}`;
    }
    if (Number.isInteger(ratingParam) && ratingParam >= 1 && ratingParam <= 5) {
      query += `&rating=eq.${ratingParam}`;
    }

    const result = await supabaseRequest<unknown[]>(config, query);
    if (!result.ok) return res.status(502).json({ error: "Could not load feedback." });
    return res.status(200).json({ items: result.data ?? [] });
  }

  if (req.method === "PATCH") {
    const body = parseBody(req.body);
    const id = typeof body.id === "string" ? body.id : "";
    const status = body.status as Status;

    if (!UUID_RE.test(id)) return res.status(400).json({ error: "Invalid feedback ID." });
    if (!STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status." });

    const result = await supabaseRequest(config, `feedback?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: { status, moderated_at: new Date().toISOString() },
    });
    if (!result.ok) return res.status(502).json({ error: "Could not update feedback." });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ error: "Method not allowed." });
};

export default handler;
