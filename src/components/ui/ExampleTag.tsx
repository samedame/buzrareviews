// Marks every product demo as fictional, per MASTER_PROMPT.md G4. Never
// omit this on a surface showing a business name, reviewer, or review text.
export function ExampleTag() {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-chip)] bg-[var(--color-mist)] px-2.5 py-1 text-small text-ink-3">
      Example
    </span>
  );
}
