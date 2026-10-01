import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text";
type Size = "default" | "large";

const base =
  "inline-flex items-center justify-center gap-2 text-button rounded-[var(--radius-control)] transition-transform duration-[var(--dur-press)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink border border-gold-edge shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.12)] hover:bg-gold-hover",
  secondary: "bg-paper text-ink border border-ink",
  text: "text-meadow underline underline-offset-[3px] decoration-1",
};

const sizes: Record<Size, string> = {
  default: "min-h-11 px-5",
  large: "min-h-13 px-6 text-[1.0625rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "default", children, className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${variant !== "text" ? sizes[size] : ""} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
