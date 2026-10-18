import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

/** Label + control + inline error wrapper used by all forms. */
export default function Field({ id, label, error, required = false, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/70">
        {label}
        {required ? (
          <span className="text-bronze" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal normal-case tracking-normal text-charcoal/45"> (optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-700" aria-live="polite">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-charcoal/50">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Helper for aria-describedby so screen readers announce hints and errors. */
export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
