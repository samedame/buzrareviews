import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { TrackedStartTrialLink } from "@/components/marketing/TrackedStartTrialLink";
import { site } from "@/config/site";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-small text-ink-3">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-small text-ink hover:text-meadow">
        {children}
      </Link>
    </li>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-mist">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="text-nav text-ink text-lg">{site.name}</span>
            </div>
            <p className="mt-3 text-small text-ink-2 max-w-[32ch]">
              Google review requests and drafted replies for businesses with one front door.
            </p>
          </div>

          <FooterColumn title="Product">
            <FooterLink href="/#how-it-works">How it works</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/dashboard">Your dashboard</FooterLink>
            <li>
              <TrackedStartTrialLink className="text-small text-ink hover:text-meadow" location="footer" />
            </li>
          </FooterColumn>

          <FooterColumn title="Who it's for">
            <FooterLink href="/for/salons">Salons and barbershops</FooterLink>
            <FooterLink href="/for/dental">Dental offices</FooterLink>
            <FooterLink href="/for/restaurants">Restaurants and cafes</FooterLink>
            <FooterLink href="/bozeman">In-person setup in Bozeman</FooterLink>
          </FooterColumn>

          <FooterColumn title="Company">
            {site.contactEmail && <FooterLink href={`mailto:${site.contactEmail}`}>Contact</FooterLink>}
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-small text-ink-3">
          <p>
            © {year} {site.name}. Made in {site.city}.
          </p>
          <p>Google is a trademark of Google LLC. {site.name} is not affiliated with or endorsed by Google.</p>
        </div>
      </Container>
    </footer>
  );
}
