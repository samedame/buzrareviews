import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { site } from "@/config/site";

export function AppHeader() {
  return (
    <header className="h-[72px] border-b border-line bg-paper">
      <Container className="flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-nav text-ink text-lg">{site.name}</span>
        </Link>
        <Link href="/bozeman" className="text-small text-meadow underline underline-offset-[3px]">
          Need help?
        </Link>
      </Container>
    </header>
  );
}
