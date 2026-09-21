import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
            P
          </span>
          <span className="text-sm font-semibold tracking-tight">Pricemist</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#how"
            className="hidden px-3 py-2 text-sm text-muted hover:text-foreground sm:inline"
          >
            How it works
          </Link>
          <Link
            href="/#proof"
            className="hidden px-3 py-2 text-sm text-muted hover:text-foreground sm:inline"
          >
            The difference
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Open demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
