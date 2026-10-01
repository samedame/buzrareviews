"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";

const WHO_ITS_FOR = [
  { label: "Salons and barbershops", href: "/for/salons" },
  { label: "Dental offices", href: "/for/dental" },
  { label: "Restaurants and cafes", href: "/for/restaurants" },
];

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  function openMenu() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setOpen(false);
      openButtonRef.current?.focus();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center justify-center rounded-[var(--radius-control)] p-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:hidden"
      >
        <Icon name="menu" />
        <VisuallyHidden>Open menu</VisuallyHidden>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="m-0 h-full max-h-none w-full max-w-none bg-paper p-0 backdrop:bg-ink/40"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMenu();
        }}
      >
        <div className="flex h-full flex-col px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-nav text-ink">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex items-center justify-center rounded-[var(--radius-control)] p-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Icon name="close" />
              <VisuallyHidden>Close menu</VisuallyHidden>
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            <Link href="/#how-it-works" onClick={closeMenu} className="text-nav text-ink py-3">
              How it works
            </Link>
            <Link href="/pricing" onClick={closeMenu} className="text-nav text-ink py-3">
              Pricing
            </Link>
            <p className="pt-4 text-small text-ink-3">Who it&apos;s for</p>
            {WHO_ITS_FOR.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeMenu} className="text-nav text-ink py-3">
                {item.label}
              </Link>
            ))}
            <Link href="/bozeman" onClick={closeMenu} className="text-nav text-ink py-3">
              Bozeman
            </Link>
            <Link href="/dashboard" onClick={closeMenu} className="text-nav text-ink py-3">
              Your dashboard
            </Link>
          </nav>

          <div className="mt-auto pb-4">
            <Button
              href="/onboarding"
              className="w-full"
              onClick={() => {
                track("start_trial_click", { location: "mobile_menu" });
                closeMenu();
              }}
            >
              Start free trial
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
