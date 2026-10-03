import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  id,
  hideLabel,
  ...rest
}: {
  label: string;
  hint?: ReactNode;
  id: string;
  hideLabel?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className={hideLabel ? "sr-only" : "block text-small font-medium text-ink"}>
        {label}
      </label>
      {hint && <p className="mt-1 text-small text-ink-3">{hint}</p>}
      <input
        id={id}
        className={`w-full rounded-[var(--radius-control)] border border-line px-3 py-2.5 text-body text-ink outline-none placeholder:text-ink-3 focus-visible:border-ink ${hideLabel ? "" : "mt-1.5"}`}
        {...rest}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  id,
  hideLabel,
  ...rest
}: {
  label: string;
  id: string;
  hideLabel?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className={hideLabel ? "sr-only" : "block text-small font-medium text-ink"}>
        {label}
      </label>
      <textarea
        id={id}
        className={`w-full rounded-[var(--radius-control)] border border-line px-3 py-2.5 text-body text-ink outline-none placeholder:text-ink-3 focus-visible:border-ink ${hideLabel ? "" : "mt-1.5"}`}
        {...rest}
      />
    </div>
  );
}
