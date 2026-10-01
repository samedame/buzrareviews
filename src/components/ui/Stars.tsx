// Custom inline SVG star (never a CSS clip-path polygon -- that's a pattern
// the Impeccable detector flags). Five points with slightly rounded joins,
// gold fill with a gold-edge stroke; empty state is outline only.
const STAR_PATH = "M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z";

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d={STAR_PATH}
        fill={filled ? "var(--color-gold)" : "none"}
        stroke="var(--color-gold-edge)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stars({
  rating,
  max = 5,
  size = 18,
  className = "",
}: {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of ${max} stars`}
      className={`inline-flex items-center gap-0.5 ${className}`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} filled={i < rating} size={size} />
      ))}
    </span>
  );
}
