import { site } from "@/config/site";
import { SUBSCRIPTION_PRICE_USD_CENTS } from "@/lib/pricing";

// Organization + SoftwareApplication structured data. Deliberately no
// aggregateRating or review markup -- BuzraReviews has no public customer
// data yet and must not claim any (MASTER_PROMPT.md B2/B3).
export function JsonLd() {
  const priceUsd = (SUBSCRIPTION_PRICE_USD_CENTS / 100).toFixed(2);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bozeman",
      addressRegion: "MT",
      addressCountry: "US",
    },
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: priceUsd,
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
    </>
  );
}
