import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { FOUNDER_NOTE } from "@/content/home";
import { LogoMark } from "@/components/ui/LogoMark";

const FOUNDER_NOTE_BODY = site.inPersonInBozeman
  ? "I'm Sam, and I build BuzraReviews here in Bozeman. You can set yourself up in a few minutes. If you run into any trouble, I'll set it up with you myself, on a call or in person if you're nearby."
  : "I'm Sam, and I build BuzraReviews here in Bozeman. You can set yourself up in a few minutes. If you run into any trouble, I'll set it up with you myself on a call.";

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
        <p className="text-lead mt-4">{FOUNDER_NOTE_BODY}</p>
        <p className="mt-4 text-small font-medium text-ink-2">{FOUNDER_NOTE.signature}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/setup" className="text-small text-meadow underline underline-offset-[3px]">
            Get setup help
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
