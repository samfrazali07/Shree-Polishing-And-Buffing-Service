/**
 * Shared validation rules. Used by the forms (inline errors) and by the
 * serverless API functions (server-side validation) so both always agree.
 */

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s\-()]{6,20}$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

export function isValidPhone(value: string): boolean {
  const v = value.trim();
  const digits = v.replace(/\D/g, "");
  return PHONE_RE.test(v) && digits.length >= 8 && digits.length <= 15;
}

/** Trims text and enforces a maximum length. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim().slice(0, max);
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/* ---------------- Feedback ---------------- */

export interface FeedbackInput {
  fullName: string;
  email: string;
  companyName: string;
  serviceUsed: string;
  rating: number;
  message: string;
  consentStorage: boolean;
  permissionToPublish: boolean;
}

export type FeedbackField = keyof FeedbackInput;

export const FEEDBACK_LIMITS = {
  fullName: 100,
  email: 254,
  companyName: 120,
  message: 1500,
  messageMin: 20,
};

export function validateFeedback(input: FeedbackInput, serviceOptions: readonly string[]): FieldErrors<FeedbackField> {
  const errors: FieldErrors<FeedbackField> = {};

  if (!input.fullName.trim()) errors.fullName = "Please enter your full name.";
  else if (input.fullName.trim().length > FEEDBACK_LIMITS.fullName) errors.fullName = "Name is too long.";

  if (!input.email.trim()) errors.email = "Please enter your email address.";
  else if (!isValidEmail(input.email)) errors.email = "Please enter a valid email address.";

  if (input.companyName.trim().length > FEEDBACK_LIMITS.companyName)
    errors.companyName = "Company name is too long.";

  if (!input.serviceUsed || !serviceOptions.includes(input.serviceUsed))
    errors.serviceUsed = "Please select the service you used.";

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
    errors.rating = "Please select a rating from 1 to 5 stars.";

  const msg = input.message.trim();
  if (!msg) errors.message = "Please share your feedback.";
  else if (msg.length < FEEDBACK_LIMITS.messageMin)
    errors.message = `Please provide at least ${FEEDBACK_LIMITS.messageMin} characters.`;
  else if (msg.length > FEEDBACK_LIMITS.message)
    errors.message = `Please keep your feedback under ${FEEDBACK_LIMITS.message} characters.`;

  if (!input.consentStorage)
    errors.consentStorage = "Please confirm consent so we can store and respond to your feedback.";

  return errors;
}

/* ---------------- Business enquiry ---------------- */

export interface EnquiryInput {
  contactPerson: string;
  companyName: string;
  businessEmail: string;
  phone: string;
  serviceType: string;
  projectLocation: string;
  projectSize: string;
  siteVisitDate: string;
  projectDetails: string;
}

export type EnquiryField = keyof EnquiryInput;

export const ENQUIRY_LIMITS = {
  contactPerson: 100,
  companyName: 150,
  projectLocation: 200,
  projectSize: 100,
  projectDetails: 3000,
  detailsMin: 30,
};

export function validateEnquiry(input: EnquiryInput, serviceOptions: readonly string[]): FieldErrors<EnquiryField> {
  const errors: FieldErrors<EnquiryField> = {};

  if (!input.contactPerson.trim()) errors.contactPerson = "Please enter the contact person's name.";
  else if (input.contactPerson.trim().length > ENQUIRY_LIMITS.contactPerson)
    errors.contactPerson = "Name is too long.";

  if (!input.companyName.trim()) errors.companyName = "Please enter the shop or company name.";
  else if (input.companyName.trim().length > ENQUIRY_LIMITS.companyName)
    errors.companyName = "Name is too long.";

  if (!input.businessEmail.trim()) errors.businessEmail = "Please enter a business email address.";
  else if (!isValidEmail(input.businessEmail)) errors.businessEmail = "Please enter a valid email address.";

  if (!input.phone.trim()) errors.phone = "Please enter a phone number.";
  else if (!isValidPhone(input.phone)) errors.phone = "Please enter a valid phone number.";

  if (!input.serviceType || !serviceOptions.includes(input.serviceType))
    errors.serviceType = "Please select the service required.";

  if (!input.projectLocation.trim()) errors.projectLocation = "Please enter the project location.";
  else if (input.projectLocation.trim().length > ENQUIRY_LIMITS.projectLocation)
    errors.projectLocation = "Location is too long.";

  if (input.projectSize.trim().length > ENQUIRY_LIMITS.projectSize)
    errors.projectSize = "Project size is too long.";

  if (input.siteVisitDate && !isValidIsoDate(input.siteVisitDate))
    errors.siteVisitDate = "Please enter a valid date.";

  const details = input.projectDetails.trim();
  if (!details) errors.projectDetails = "Please describe your project.";
  else if (details.length < ENQUIRY_LIMITS.detailsMin)
    errors.projectDetails = `Please provide at least ${ENQUIRY_LIMITS.detailsMin} characters so we can understand your project.`;
  else if (details.length > ENQUIRY_LIMITS.projectDetails)
    errors.projectDetails = `Please keep project details under ${ENQUIRY_LIMITS.projectDetails} characters.`;

  return errors;
}
