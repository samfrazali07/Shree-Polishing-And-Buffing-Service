import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { BUSINESS, WHATSAPP_URL } from "../../config/site";
import { SERVICE_FORM_OPTIONS } from "../../data/content";
import { ENQUIRE_SERVICE_EVENT } from "../../lib/events";
import { sendJson } from "../../lib/api";
import {
  ENQUIRY_LIMITS,
  validateEnquiry,
  type EnquiryField,
  type EnquiryInput,
  type FieldErrors,
} from "../../lib/validation";
import { AlertIcon, CheckIcon } from "../ui/Icons";
import Field, { describedBy } from "./Field";

type Status = "idle" | "submitting" | "success" | "error" | "unavailable";
type Values = EnquiryInput & { website: string };

const EMPTY: Values = {
  contactPerson: "",
  companyName: "",
  businessEmail: "",
  phone: "",
  serviceType: "",
  projectLocation: "",
  projectSize: "",
  siteVisitDate: "",
  projectDetails: "",
  website: "",
};

const inputClass = "field-input";

export default function EnquiryForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [serverFieldErrors, setServerFieldErrors] = useState<FieldErrors<EnquiryField>>({});
  const submittingRef = useRef(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Pre-select a service when a visitor clicks "Enquire About This Service".
  useEffect(() => {
    const onRequest = (e: Event) => {
      const service = (e as CustomEvent<{ service: string }>).detail?.service;
      if (!service) return;
      setValues((v) => ({ ...v, serviceType: service }));
      setServerFieldErrors((errs) => ({ ...errs, serviceType: undefined }));
      window.setTimeout(() => document.getElementById("en-contactPerson")?.focus({ preventScroll: true }), 650);
    };
    window.addEventListener(ENQUIRE_SERVICE_EVENT, onRequest);
    return () => window.removeEventListener(ENQUIRE_SERVICE_EVENT, onRequest);
  }, []);

  const { website, ...payload } = values;
  const clientErrors = useMemo(() => validateEnquiry(payload, SERVICE_FORM_OPTIONS), [payload]);
  const errors: FieldErrors<EnquiryField> = { ...clientErrors, ...serverFieldErrors };
  const show = (field: EnquiryField) => (attempted || touched[field]) && errors[field] ? errors[field] : undefined;

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setServerFieldErrors((e) => ({ ...e, [key]: undefined }));
  };
  const blur = (field: EnquiryField) => setTouched((t) => ({ ...t, [field]: true }));

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setAttempted(false);
    setServerFieldErrors({});
    setServerError("");
    setStatus("idle");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittingRef.current || status === "submitting") return;

    setAttempted(true);
    setServerError("");

    if (Object.keys(clientErrors).length > 0) {
      const first = Object.keys(clientErrors)[0];
      document.getElementById(`en-${first}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    const result = await sendJson<{ ok: boolean }>("/api/enquiry", "POST", { ...payload, website });

    submittingRef.current = false;

    if (result.ok) {
      setStatus("success");
      return;
    }

    if (result.code === "not_configured") {
      setStatus("unavailable");
      setServerError(result.error);
      return;
    }

    if (result.fieldErrors) {
      setServerFieldErrors(result.fieldErrors as FieldErrors<EnquiryField>);
      const first = Object.keys(result.fieldErrors)[0];
      if (first) document.getElementById(`en-${first}`)?.focus();
    }
    setServerError(result.error);
    setStatus("error");
  };

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-6 border border-champagne/50 bg-charcoal p-10 text-ivory">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne text-charcoal">
          <CheckIcon size={22} />
        </span>
        <div className="space-y-3">
          <h3 className="font-serif text-3xl">Your enquiry has been received.</h3>
          <p className="max-w-md text-sm leading-relaxed text-ivory/75">
            Thank you for considering Shree Polishing And Buffing Service. A member of the team will be in touch to
            discuss your polishing requirements and next steps.
          </p>
        </div>
        <button type="button" onClick={reset} className="btn-outline !px-6 !py-3">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="enquiry-form-title" className="flex flex-col gap-8">
      <div>
        <h3 id="enquiry-form-title" className="font-serif text-3xl text-charcoal">
          Business Enquiry
        </h3>
        <p className="mt-2 text-sm text-charcoal/60">
          Tell us about your brass or copper metalware. We will respond with a project-specific quotation where
          appropriate.
        </p>
      </div>

      {/* Honeypot: hidden from people, used to catch automated submissions */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="en-website">Leave this field empty</label>
        <input
          id="en-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <TextField
          id="en-contactPerson"
          label="Full Name"
          required
          autoComplete="name"
          value={values.contactPerson}
          maxLength={ENQUIRY_LIMITS.contactPerson}
          error={show("contactPerson")}
          onChange={(v) => update("contactPerson", v)}
          onBlur={() => blur("contactPerson")}
        />
        <TextField
          id="en-companyName"
          label="Hotel / Business Name"
          required
          autoComplete="organization"
          value={values.companyName}
          maxLength={ENQUIRY_LIMITS.companyName}
          error={show("companyName")}
          onChange={(v) => update("companyName", v)}
          onBlur={() => blur("companyName")}
        />
        <TextField
          id="en-businessEmail"
          label="Business Email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={values.businessEmail}
          error={show("businessEmail")}
          onChange={(v) => update("businessEmail", v)}
          onBlur={() => blur("businessEmail")}
        />
        <TextField
          id="en-phone"
          label="Phone Number"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          value={values.phone}
          error={show("phone")}
          onChange={(v) => update("phone", v)}
          onBlur={() => blur("phone")}
        />

        <Field id="en-serviceType" label="Type of Metalware / Service" required error={show("serviceType")}>
          <select
            id="en-serviceType"
            name="serviceType"
            className={`${inputClass} appearance-none`}
            aria-invalid={!!show("serviceType")}
            aria-describedby={describedBy("en-serviceType", show("serviceType"))}
            value={values.serviceType}
            onChange={(e) => update("serviceType", e.target.value)}
            onBlur={() => blur("serviceType")}
          >
            <option value="">Select a service</option>
            {SERVICE_FORM_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <TextField
          id="en-projectLocation"
          label="Project Location"
          required
          autoComplete="off"
          value={values.projectLocation}
          maxLength={ENQUIRY_LIMITS.projectLocation}
          error={show("projectLocation")}
          onChange={(v) => update("projectLocation", v)}
          onBlur={() => blur("projectLocation")}
        />
        <TextField
          id="en-projectSize"
          label="Quantity of Items"
          optional
          placeholder="e.g. 50 thalis, 20 kadhai, bulk lot"
          value={values.projectSize}
          maxLength={ENQUIRY_LIMITS.projectSize}
          error={show("projectSize")}
          onChange={(v) => update("projectSize", v)}
          onBlur={() => blur("projectSize")}
        />
        <TextField
          id="en-siteVisitDate"
          label="Preferred Date"
          type="date"
          optional
          min={today}
          value={values.siteVisitDate}
          error={show("siteVisitDate")}
          onChange={(v) => update("siteVisitDate", v)}
          onBlur={() => blur("siteVisitDate")}
          hint="Optional — subject to confirmation."
        />
      </div>

      <Field
        id="en-projectDetails"
        label="Additional Requirements"
        required
        error={show("projectDetails")}
        hint={`${values.projectDetails.length}/${ENQUIRY_LIMITS.projectDetails} characters`}
      >
        <textarea
          id="en-projectDetails"
          name="projectDetails"
          rows={5}
          maxLength={ENQUIRY_LIMITS.projectDetails}
          className={`${inputClass} resize-y`}
          aria-invalid={!!show("projectDetails")}
          aria-describedby={describedBy("en-projectDetails", show("projectDetails"), "count")}
          value={values.projectDetails}
          onChange={(e) => update("projectDetails", e.target.value)}
          onBlur={() => blur("projectDetails")}
        />
      </Field>

      {status === "unavailable" && (
        <div role="alert" className="flex gap-4 border border-bronze/60 bg-ivory-deep p-5 text-sm leading-relaxed text-charcoal/80">
          <AlertIcon size={20} className="mt-0.5 shrink-0 text-bronze" />
          <div className="space-y-2">
            <p>
              <strong className="font-semibold">Setup required:</strong> enquiry storage is not connected on this
              deployment, so your enquiry was <strong>not saved</strong>.
            </p>
            <p>
              Please contact us directly on{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-bronze underline underline-offset-4">
                WhatsApp {BUSINESS.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {status === "error" && serverError && (
        <div role="alert" className="flex gap-4 border border-red-700/40 bg-red-50 p-5 text-sm text-red-900">
          <AlertIcon size={20} className="mt-0.5 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-charcoal/50">
          Your details are used only to respond to your enquiry.
        </p>
        <button
          id="enquiry-submit"
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="btn-primary w-full sm:w-auto"
        >
          {status === "submitting" ? "Sending…" : "Submit Business Enquiry"}
        </button>
      </div>
    </form>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  placeholder?: string;
  maxLength?: number;
  min?: string;
  hint?: string;
}

function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  optional,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
  min,
  hint,
}: TextFieldProps): ReactNode {
  return (
    <Field id={id} label={label} error={error} required={required} hint={hint}>
      <input
        id={id}
        name={id.replace("en-", "")}
        type={type}
        value={value}
        required={required && !optional}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        className={inputClass}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
    </Field>
  );
}
