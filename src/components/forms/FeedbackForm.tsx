import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SERVICE_FORM_OPTIONS } from "../../data/content";
import { sendJson } from "../../lib/api";
import {
  FEEDBACK_LIMITS,
  validateFeedback,
  type FeedbackField,
  type FeedbackInput,
  type FieldErrors,
} from "../../lib/validation";
import { AlertIcon, CheckIcon, StarIcon } from "../ui/Icons";
import Field, { describedBy } from "./Field";

type Status = "idle" | "submitting" | "success" | "error" | "unavailable";

const EMPTY: FeedbackInput & { website: string } = {
  fullName: "",
  email: "",
  companyName: "",
  serviceUsed: "",
  rating: 0,
  message: "",
  consentStorage: false,
  permissionToPublish: false,
  website: "", // honeypot: hidden from people, filled in by bots
};

const inputClass = "field-input";

export default function FeedbackForm() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FeedbackField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string>("");
  const [serverFieldErrors, setServerFieldErrors] = useState<FieldErrors<FeedbackField>>({});
  const submittingRef = useRef(false);

  const { website, ...payload } = values;
  const clientErrors = useMemo(() => validateFeedback(payload, SERVICE_FORM_OPTIONS), [payload]);
  const errors: FieldErrors<FeedbackField> = { ...clientErrors, ...serverFieldErrors };

  const show = (field: FeedbackField) => (attempted || touched[field]) && errors[field] ? errors[field] : undefined;

  const update = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setServerFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  const blur = (field: FeedbackField) => setTouched((t) => ({ ...t, [field]: true }));

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
    // Prevent accidental duplicate submissions (double-clicks, Enter key repeats).
    if (submittingRef.current || status === "submitting") return;

    setAttempted(true);
    setServerError("");

    if (Object.keys(clientErrors).length > 0) {
      const first = (Object.keys(clientErrors)[0] as FeedbackField) ?? "fullName";
      document.getElementById(`fb-${first}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    const result = await sendJson<{ ok: boolean }>("/api/feedback", "POST", {
      fullName: payload.fullName,
      email: payload.email,
      companyName: payload.companyName,
      serviceUsed: payload.serviceUsed,
      rating: payload.rating,
      message: payload.message,
      consentStorage: payload.consentStorage,
      permissionToPublish: payload.permissionToPublish,
      website, // honeypot value, checked on the server
    });

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
      setServerFieldErrors(result.fieldErrors as FieldErrors<FeedbackField>);
      const first = Object.keys(result.fieldErrors)[0];
      if (first) document.getElementById(`fb-${first}`)?.focus();
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
          <h3 className="font-serif text-3xl">Thank you for your feedback.</h3>
          <p className="max-w-md text-sm leading-relaxed text-ivory/75">
            Your feedback has been received. If you gave permission to publish, it will appear here only after it has
            been reviewed.
          </p>
        </div>
        <button type="button" onClick={reset} className="btn-outline !px-6 !py-3">
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="feedback-form-title" className="flex flex-col gap-8">
      <h3 id="feedback-form-title" className="font-serif text-3xl text-charcoal">
        Share Your Experience
      </h3>

      {/* Honeypot: real users never see or fill this field */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="fb-website">Leave this field empty</label>
        <input
          id="fb-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="fb-fullName" label="Full Name" required error={show("fullName")}>
          <input
            id="fb-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={FEEDBACK_LIMITS.fullName}
            className={inputClass}
            aria-invalid={!!show("fullName")}
            aria-describedby={describedBy("fb-fullName", show("fullName"))}
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            onBlur={() => blur("fullName")}
          />
        </Field>

        <Field id="fb-email" label="Email Address" required error={show("email")}>
          <input
            id="fb-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            aria-invalid={!!show("email")}
            aria-describedby={describedBy("fb-email", show("email"))}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => blur("email")}
          />
        </Field>

        <Field id="fb-companyName" label="Shop / Company Name" error={show("companyName")}>
          <input
            id="fb-companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            maxLength={FEEDBACK_LIMITS.companyName}
            className={inputClass}
            aria-invalid={!!show("companyName")}
            aria-describedby={describedBy("fb-companyName", show("companyName"))}
            value={values.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            onBlur={() => blur("companyName")}
          />
        </Field>

        <Field id="fb-serviceUsed" label="Service Used" required error={show("serviceUsed")}>
          <select
            id="fb-serviceUsed"
            name="serviceUsed"
            className={`${inputClass} appearance-none pr-6`}
            aria-invalid={!!show("serviceUsed")}
            aria-describedby={describedBy("fb-serviceUsed", show("serviceUsed"))}
            value={values.serviceUsed}
            onChange={(e) => update("serviceUsed", e.target.value)}
            onBlur={() => blur("serviceUsed")}
          >
            <option value="">Select a service</option>
            {SERVICE_FORM_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Star rating: native radios for full keyboard and screen reader support */}
      <fieldset className="flex flex-col gap-3" aria-describedby={show("rating") ? "fb-rating-error" : undefined}>
        <legend className="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/70">
          Star Rating <span className="text-bronze" aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = values.rating >= n;
            return (
              <label
                key={n}
                className="group relative inline-flex cursor-pointer items-center gap-2 border border-charcoal/15 px-3 py-2 text-sm text-charcoal/70 transition-colors has-[:checked]:border-bronze has-[:checked]:text-bronze has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-champagne"
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  className="sr-only"
                  checked={values.rating === n}
                  onChange={() => update("rating", n)}
                  onBlur={() => blur("rating")}
                />
                <StarIcon size={16} className={active ? "fill-current text-champagne" : "text-charcoal/30"} />
                <span>{n}</span>
                <span className="sr-only">{n === 1 ? "star" : "stars"}</span>
              </label>
            );
          })}
        </div>
        {show("rating") && (
          <p id="fb-rating-error" className="text-xs text-red-700" aria-live="polite">
            {show("rating")}
          </p>
        )}
      </fieldset>

      <Field
        id="fb-message"
        label="Feedback Message"
        required
        error={show("message")}
        hint={`${values.message.length}/${FEEDBACK_LIMITS.message} characters`}
      >
        <textarea
          id="fb-message"
          name="message"
          rows={5}
          maxLength={FEEDBACK_LIMITS.message}
          className={`${inputClass} resize-y`}
          aria-invalid={!!show("message")}
          aria-describedby={describedBy("fb-message", show("message"), "x")}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => blur("message")}
        />
      </Field>

      <div className="flex flex-col gap-5">
        <CheckboxRow
          id="fb-consentStorage"
          checked={values.consentStorage}
          onChange={(v) => update("consentStorage", v)}
          onBlur={() => blur("consentStorage")}
          error={show("consentStorage")}
          required
        >
          I agree that Shree Polishing And Buffing Service may store my details and feedback to respond to me and
          improve its services. <span className="text-bronze">*</span>
        </CheckboxRow>

        <CheckboxRow
          id="fb-permissionToPublish"
          checked={values.permissionToPublish}
          onChange={(v) => update("permissionToPublish", v)}
          onBlur={() => blur("permissionToPublish")}
        >
          I give permission for my feedback to be shown publicly on this website after it has been moderated. My
          name will be shortened to first name and last initial.
        </CheckboxRow>
      </div>

      {status === "unavailable" && (
        <div role="alert" className="flex gap-4 border border-bronze/60 bg-ivory-deep p-5 text-sm leading-relaxed text-charcoal/80">
          <AlertIcon size={20} className="mt-0.5 shrink-0 text-bronze" />
          <p>
            <strong className="font-semibold">Setup required:</strong> feedback storage is not connected on this
            deployment, so your feedback was <strong>not saved</strong>. Please reach us on WhatsApp instead.
          </p>
        </div>
      )}

      {status === "error" && serverError && (
        <div role="alert" className="flex gap-4 border border-red-700/40 bg-red-50 p-5 text-sm text-red-900">
          <AlertIcon size={20} className="mt-0.5 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-charcoal/50">Fields marked * are required.</p>
        <button
          id="feedback-submit"
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="btn-primary w-full sm:w-auto"
        >
          {status === "submitting" ? "Submitting…" : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
}

function CheckboxRow({
  id,
  checked,
  onChange,
  onBlur,
  error,
  required,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-4 text-sm leading-relaxed text-charcoal/75">
        <input
          id={id}
          type="checkbox"
          required={required}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[#8c6a43]"
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="pl-8 text-xs text-red-700" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
