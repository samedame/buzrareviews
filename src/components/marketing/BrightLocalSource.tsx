import { Icon } from "@/components/ui/Icon";
import { BRIGHTLOCAL_SOURCE } from "@/content/home";

// Shared with the home page's WhyItMatters section (Fix pass 2, issue 1):
// every rendered BrightLocal statistic needs this exact source line, same
// tab, same external-link icon, same href.
export function BrightLocalSource({ className = "" }: { className?: string }) {
  return (
    <a
      href={BRIGHTLOCAL_SOURCE.href}
      className={`inline-flex items-center gap-1 text-small text-meadow underline underline-offset-[3px] ${className}`}
    >
      {BRIGHTLOCAL_SOURCE.label}
      <Icon name="external-link" size={14} />
    </a>
  );
}
