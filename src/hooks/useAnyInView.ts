import { useEffect, useState } from "react";

/**
 * Returns true while ANY of the element ids is inside the viewport.
 * Used to hide floating action buttons while a form submit button is visible,
 * so the floating WhatsApp / back-to-top buttons never cover form controls.
 */
export function useAnyInView(ids: string[]): boolean {
  const [visible, setVisible] = useState(false);
  const key = ids.join("|");

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visibleSet = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSet.add(entry.target);
          else visibleSet.delete(entry.target);
        });
        setVisible(visibleSet.size > 0);
      },
      { rootMargin: "0px 0px 0px 0px", threshold: 0 },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return visible;
}
