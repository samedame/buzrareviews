"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function BusinessSearchForm({
  id,
  variant = "light",
  onQueryChange,
}: {
  id: string;
  variant?: "light" | "dark";
  onQueryChange?: (value: string) => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!onQueryChange) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onQueryChange(value.slice(0, 40)), 150);
    return () => clearTimeout(debounceRef.current);
  }, [value, onQueryChange]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError(true);
      inputRef.current?.focus();
      return;
    }
    setError(false);
    router.push(`/onboarding?q=${encodeURIComponent(trimmed)}`);
  }

  const dark = variant === "dark";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id} className={`block text-small font-medium ${dark ? "text-paper" : "text-ink"}`}>
        Start with your business name
      </label>
      <div
        className={`mt-2 flex flex-col gap-2 rounded-[var(--radius-search)] p-1.5 sm:flex-row sm:items-center sm:gap-1 ${
          dark ? "" : "border-2 border-ink"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="organization"
          maxLength={100}
          placeholder="Business name and town"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          className="min-w-0 flex-1 rounded-[calc(var(--radius-search)-6px)] bg-paper px-3 py-2.5 text-body text-ink outline-none placeholder:text-ink-3"
        />
        <Button type="submit" size="large" className="sm:shrink-0">
          Find my business
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-small text-brick" role="alert">
          Type your business name first.
        </p>
      )}
    </form>
  );
}
