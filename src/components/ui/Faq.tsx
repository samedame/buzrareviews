import { Icon } from "@/components/ui/Icon";
import type { FaqItem } from "@/content/faq";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const external = item.link?.href.startsWith("http");
        return (
          <details key={item.id} className="faq-item group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-h3 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="text-ink">{item.question}</span>
              <Icon name="plus" className="shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <div className="pt-3">
              <p className="text-body text-ink-2 max-w-[68ch]">{item.answer}</p>
              {item.link && (
                <a
                  href={item.link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="mt-2 inline-flex items-center gap-1 text-small text-meadow underline underline-offset-[3px]"
                >
                  {item.link.label}
                  {external && <Icon name="external-link" size={14} />}
                </a>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
