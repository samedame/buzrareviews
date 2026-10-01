import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { FOUNDER_NOTE } from "@/content/home";
import { LogoMark } from "@/components/ui/LogoMark";

export function FounderNote() {
  return (
    <div className={`grid gap-8 ${site.founderPhoto ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] sm:items-start" : ""}`}>
      {site.founderPhoto && (
        <div className="aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-[var(--radius-card)]">
          <Image
            src={site.founderPhoto}
            alt={`${site.founderName}, founder of ${site.name}`}
            width={480}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div>
        {!site.founderPhoto && <LogoMark size={28} />}
        <p className="text-lead mt-4">{FOUNDER_NOTE.body}</p>
        <p className="mt-4 text-small font-medium text-ink-2">{FOUNDER_NOTE.signature}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/bozeman" className="text-small text-meadow underline underline-offset-[3px]">
            Having trouble? Get help from Sam
          </Link>
          {site.contactEmail && (
            <a href={`mailto:${site.contactEmail}`} className="text-small text-meadow underline underline-offset-[3px]">
              Email Sam
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
