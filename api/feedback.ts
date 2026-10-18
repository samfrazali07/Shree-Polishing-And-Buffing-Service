import { parseBody, type ApiHandler } from "../server/lib/http";
import { getSupabaseConfig, supabaseRequest, type SupabaseConfig } from "../server/lib/supabase";
import { SERVICE_FORM_OPTIONS } from "../src/data/content";
import { cleanText, FEEDBACK_LIMITS, validateFeedback, type FeedbackInput } from "../src/lib/validation";

/**
 * GET  /api/feedback -> published feedback only (approved AND publish permission granted).
 * POST /api/feedback -> stores new feedback as "pending" for moderation.
 *
 * Privacy: public responses never include email addresses, and reviewer names are shortened.
 */

interface FeedbackRow {
  id: string;
  full_name: string;
  company_name: string | null;
  service_used: string;
  rating: number;
  message: string;
  created_at: string;
}

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const handler: ApiHandler = async (req, res) => {
  if (req.method === "GET") return listPublished(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = parseBody(req.body);

  // Honeypot: bots fill hidden fields. Pretend success without storing anything.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return res.status(201).json({ ok: true });
  }

  const input: FeedbackInput = {
    fullName: cleanText(body.fullName, FEEDBACK_LIMITS.fullName),
    email: cleanText(body.email, FEEDBACK_LIMITS.email),
    companyName: cleanText(body.companyName, FEEDBACK_LIMITS.companyName),
    serviceUsed: cleanText(body.serviceUsed, 200),
    rating: typeof body.rating === "number" ? body.rating : Number(body.rating),
    message: cleanText(body.message, FEEDBACK_LIMITS.message),
    consentStorage: body.consentStorage === true,
    permissionToPublish: body.permissionToPublish === true,
  };

  const fieldErrors = validateFeedback(input, SERVICE_FORM_OPTIONS);
  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({ error: "Please correct the highlighted fields.", fieldErrors });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return res.status(503).json({
      error: "Feedback storage is not configured on this deployment.",
      code: "not_configured",
    });
  }

  const email = input.email.toLowerCase();

  if (await isDuplicate(config, email, input.message)) {
    return res.status(200).json({ ok: true, duplicate: true });
  }

  const result = await supabaseRequest(config, "feedback", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      full_name: input.fullName,
      email,
      company_name: input.companyName || null,
      service_used: input.serviceUsed,
      rating: input.rating,
      message: input.message,
      consent_storage: true,
      permission_to_publish: input.permissionToPublish,
      status: "pending",
    },
  });

  if (!result.ok) {
    return res.status(502).json({ error: "We could not save your feedback. Please try again later." });
  }

  return res.status(201).json({ ok: true });
};

async function isDuplicate(config: SupabaseConfig, email: string, message: string): Promise<boolean> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const query =
    `feedback?select=id&limit=1` +
    `&email=eq.${encodeURIComponent(email)}` +
    `&message=eq.${encodeURIComponent(message)}` +
    `&created_at=gte.${encodeURIComponent(since)}`;
  const result = await supabaseRequest<{ id: string }[]>(config, query);
  return result.ok && Array.isArray(result.data) && result.data.length > 0;
}

async function listPublished(res: Parameters<ApiHandler>[1]) {
  const config = getSupabaseConfig();
  if (!config) return res.status(200).json({ configured: false, items: [] });

  const query =
    "feedback?status=eq.approved&permission_to_publish=eq.true" +
    "&select=id,full_name,company_name,service_used,rating,message,created_at" +
    "&order=created_at.desc&limit=60";

  const result = await supabaseRequest<FeedbackRow[]>(config, query);
  if (!result.ok || !result.data) {
    return res.status(502).json({ error: "Published feedback is unavailable right now." });
  }

  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json({
    configured: true,
    items: result.data.map((row) => ({
      id: row.id,
      displayName: shortenName(row.full_name),
      companyName: row.company_name,
      serviceUsed: row.service_used,
      rating: row.rating,
      message: row.message,
      createdAt: row.created_at,
    })),
  });
}

/** "Jane Elizabeth Smith" -> "Jane S." */
function shortenName(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Website visitor";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

export default handler;
