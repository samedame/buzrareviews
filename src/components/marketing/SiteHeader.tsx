"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/LogoMark";
import { MobileMenu } from "@/components/marketing/MobileMenu";
import { site } from "@/config/site";

const WHO_ITS_FOR = [
  { label: "Salons and barbershops", href: "/for/salons" },
  ...(site.showHealthcare ? [{ label: "Dental offices", href: "/for/dental" }] : []),
  { label: "Restaurants and cafes", href: "/for/restaurants" },
];

function WhoItsForMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-nav text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Who it&apos;s for
        <Icon name="chevron" size={16} className={`transition-transform duration-[var(--dur-ui)] ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-3 w-64 rounded-[var(--radius-card)] border border-line bg-paper p-2 shadow-[0_2px_0_rgb(19_37_29_/_0.06)]"
        >
          {WHO_ITS_FOR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-[var(--radius-control)] px-3 py-2 text-small text-ink hover:bg-mist"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 h-[72px] bg-paper transition-[border-color] duration-200 border-b ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-nav text-ink text-lg">{site.name}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          <Link href="/#how-it-works" className="text-nav text-ink">
            How it works
          </Link>
          <Link href="/pricing" className="text-nav text-ink">
            Pricing
          </Link>
          <WhoItsForMenu />
          <Link href="/setup" className="text-nav text-ink">
            Setup help
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="hidden lg:inline text-nav text-meadow underline underline-offset-[3px]">
            Your dashboard
          </Link>
          <div className="hidden lg:block">
            <Button href="/onboarding" onClick={() => track("start_trial_click", { location: "header" })}>
              Start free trial
            </Button>
          </div>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
