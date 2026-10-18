import { parseBody, type ApiHandler } from "../server/lib/http";
import { getSupabaseConfig, supabaseRequest, type SupabaseConfig } from "../server/lib/supabase";
import { SERVICE_FORM_OPTIONS } from "../src/data/content";
import { cleanText, ENQUIRY_LIMITS, validateEnquiry, type EnquiryInput } from "../src/lib/validation";

/**
 * POST /api/enquiry -> stores a business consultation enquiry for the team to follow up.
 */

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const handler: ApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = parseBody(req.body);

  // Honeypot: bots fill hidden fields. Pretend success without storing anything.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return res.status(201).json({ ok: true });
  }

  const input: EnquiryInput = {
    contactPerson: cleanText(body.contactPerson, ENQUIRY_LIMITS.contactPerson),
    companyName: cleanText(body.companyName, ENQUIRY_LIMITS.companyName),
    businessEmail: cleanText(body.businessEmail, 254),
    phone: cleanText(body.phone, 30),
    serviceType: cleanText(body.serviceType, 200),
    projectLocation: cleanText(body.projectLocation, ENQUIRY_LIMITS.projectLocation),
    projectSize: cleanText(body.projectSize, ENQUIRY_LIMITS.projectSize),
    siteVisitDate: cleanText(body.siteVisitDate, 10),
    projectDetails: cleanText(body.projectDetails, ENQUIRY_LIMITS.projectDetails),
  };

  const fieldErrors = validateEnquiry(input, SERVICE_FORM_OPTIONS);
  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({ error: "Please correct the highlighted fields.", fieldErrors });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return res.status(503).json({
      error: "Enquiry storage is not configured on this deployment.",
      code: "not_configured",
    });
  }

  const email = input.businessEmail.toLowerCase();

  if (await isDuplicate(config, email, input.projectDetails)) {
    return res.status(200).json({ ok: true, duplicate: true });
  }

  const result = await supabaseRequest(config, "enquiries", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      contact_person: input.contactPerson,
      company_name: input.companyName,
      business_email: email,
      phone: input.phone,
      service_type: input.serviceType,
      project_location: input.projectLocation,
      project_size: input.projectSize || null,
      site_visit_date: input.siteVisitDate || null,
      project_details: input.projectDetails,
      status: "new",
    },
  });

  if (!result.ok) {
    return res.status(502).json({ error: "We could not save your enquiry. Please try again or contact us on WhatsApp." });
  }

  return res.status(201).json({ ok: true });
};

async function isDuplicate(config: SupabaseConfig, email: string, details: string): Promise<boolean> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const query =
    `enquiries?select=id&limit=1` +
    `&business_email=eq.${encodeURIComponent(email)}` +
    `&project_details=eq.${encodeURIComponent(details)}` +
    `&created_at=gte.${encodeURIComponent(since)}`;
  const result = await supabaseRequest<{ id: string }[]>(config, query);
  return result.ok && Array.isArray(result.data) && result.data.length > 0;
}

export default handler;
