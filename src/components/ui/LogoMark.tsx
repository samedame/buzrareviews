// The BuzraReviews mark: a single gold star, decorative (the wordmark next
// to it carries the accessible name). Same star path as Stars.tsx, kept
// separate because this is a logo, not a rating.
const STAR_PATH = "M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z";

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d={STAR_PATH} fill="var(--color-gold)" stroke="var(--color-gold-edge)" strokeWidth={1} strokeLinejoin="round" />
    </svg>
  );
}
