"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { BusinessSearchForm } from "@/components/marketing/BusinessSearchForm";
import { ReviewLoopDemo } from "@/components/marketing/ReviewLoopDemo";
import type { VerticalId } from "@/content/demo";

export function VerticalHero({
  vertical,
  searchId,
  h1,
  lead,
}: {
  vertical: VerticalId;
  searchId: string;
  h1: string;
  lead: string;
}) {
  const [query, setQuery] = useState("");

  return (
    <section aria-labelledby="vertical-hero-heading" className="py-10 sm:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <h1 id="vertical-hero-heading" className="text-hero text-ink">
              {h1}
            </h1>
            <p className="text-lead text-ink-2 mt-6">{lead}</p>
            <div className="mt-8">
              <BusinessSearchForm id={searchId} location="vertical" onQueryChange={setQuery} />
            </div>
          </div>
          <div className="lg:col-span-6">
            <ReviewLoopDemo initialVertical={vertical} showVerticalSwitch={false} personalizedName={query} />
          </div>
        </div>
      </Container>
    </section>
  );
}
