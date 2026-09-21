import Link from "next/link";
import { siteName } from "@/lib/site";

export function MarketingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight">
            {siteName}
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/#proof"
            className="hidden text-sm text-foreground/70 hover:text-foreground sm:inline"
          >
            Best deals
          </Link>
          <Link
            href="/#how"
            className="hidden text-sm text-foreground/70 hover:text-foreground sm:inline"
          >
            How it works
          </Link>
          <Link
            href="/dashboard?view=deals"
            className="bg-[#1e1812] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7f1e6]"
          >
            See today's deals
          </Link>
        </nav>
      </div>
    </header>
  );
}
