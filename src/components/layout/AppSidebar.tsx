import Link from "next/link";
import { seedStores } from "@/lib/seed/catalog";
import type { CatalogProduct } from "@/lib/catalog/demo";
import { matchesView, SMART_VIEWS, type SmartView } from "@/lib/catalog/views";

function hrefFor(view: SmartView, store?: string) {
  const params = new URLSearchParams();
  if (view !== "all") {
    params.set("view", view);
  }
  if (store) {
    params.set("store", store);
  }
  const query = params.toString();
  return query ? `/dashboard?${query}` : "/dashboard";
}

export function AppSidebar({
  products,
  activeView,
  activeStore,
}: {
  products: CatalogProduct[];
  activeView: SmartView;
  activeStore?: string;
}) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-white px-4 py-5 lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
          P
        </span>
        <span className="text-sm font-semibold tracking-tight">Pricemist</span>
      </Link>

      <p className="px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        Smart Views
      </p>
      <nav className="mt-2 flex flex-col gap-0.5">
        {SMART_VIEWS.map((view) => {
          const count = products.filter((product) =>
            matchesView(product.metrics, view.id),
          ).length;
          const selected = activeView === view.id && !activeStore;
          return (
            <Link
              key={view.id}
              href={hrefFor(view.id)}
              className={`flex items-center justify-between rounded-lg px-2 py-2 text-sm ${
                selected
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-foreground hover:bg-black/[0.03]"
              }`}
            >
              <span>{view.label}</span>
              <span className={selected ? "text-accent" : "text-muted"}>
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      <p className="mt-8 px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        Your Collections
      </p>
      <nav className="mt-2 flex flex-col gap-0.5">
        {seedStores.map((store) => {
          const count = products.filter(
            (product) => product.storeSlug === store.slug,
          ).length;
          const selected = activeStore === store.slug;
          return (
            <Link
              key={store.slug}
              href={hrefFor(activeView, store.slug)}
              className={`flex items-center justify-between rounded-lg px-2 py-2 text-sm ${
                selected
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-foreground hover:bg-black/[0.03]"
              }`}
            >
              <span>{store.name}</span>
              <span className={selected ? "text-accent" : "text-muted"}>
                {count}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
