import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";
import { site } from "@/config/site";

export default function NotFound() {
  return (
    <main className="flex min-h-full flex-1 items-center py-16">
      <Container className="max-w-xl">
        <Link href="/" className="inline-flex items-center gap-2">
          <LogoMark />
          <span className="text-nav text-ink text-lg">{site.name}</span>
        </Link>
        <h1 className="text-h2 text-ink mt-8">We couldn&apos;t find that page.</h1>
        <p className="text-body text-ink-2 mt-3">The link may be old, or the page may have moved.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/">Go to the homepage</Button>
          <Button href="/onboarding" variant="secondary">
            Start free trial
          </Button>
        </div>
      </Container>
    </main>
  );
}
