export const ENQUIRE_SERVICE_EVENT = "shree:enquire-service";

/** Pre-selects a service in the enquiry form and scrolls to the contact section. */
export function requestServiceEnquiry(service: string) {
  window.dispatchEvent(new CustomEvent<{ service: string }>(ENQUIRE_SERVICE_EVENT, { detail: { service } }));
  const target = document.getElementById("contact");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#contact");
  }
}
