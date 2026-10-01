"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { BusinessSearchForm } from "@/components/marketing/BusinessSearchForm";
import { ReviewLoopDemo } from "@/components/marketing/ReviewLoopDemo";
import { FACTS_ROW } from "@/content/home";

export function Hero() {
  const [query, setQuery] = useState("");

  return (
    <section aria-labelledby="hero-heading" className="py-10 sm:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <p className="text-small text-ink-2 max-w-[48ch]">
              For salons, dental offices, restaurants, and every shop with one front door.
            </p>
            <h1 id="hero-heading" className="text-hero text-ink mt-4">
              Ask every customer. Answer every review.
            </h1>
            <p className="text-lead text-ink-2 mt-6">
              Add a customer after their visit and BuzraReviews emails them a friendly review request from your
              business. Every day, it checks Google for new reviews and drafts a reply to each one in your voice.
              $29 a month. No contract.
            </p>

            <div className="mt-8">
              <BusinessSearchForm id="hero-search" onQueryChange={setQuery} />
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {FACTS_ROW.map((fact) => (
                <li key={fact} className="flex items-center gap-2 text-small text-ink-2">
                  <Icon name="check" size={16} className="text-meadow" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <ReviewLoopDemo personalizedName={query} />
          </div>
        </div>
      </Container>
    </section>
  );
}
