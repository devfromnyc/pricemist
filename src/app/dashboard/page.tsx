import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { queryCatalog } from "@/lib/catalog/demo";
import { SMART_VIEWS } from "@/lib/catalog/views";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; store?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { view, products, all } = queryCatalog(params);
  const current = SMART_VIEWS.find((item) => item.id === view) ?? SMART_VIEWS[0];

  return (
    <div className="flex min-h-dvh bg-white">
      <AppSidebar
        products={all}
        activeView={view}
        activeStore={params.store}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-5 py-4 lg:px-8">
          <div>
            <p className="text-xs font-medium text-accent">Demo snapshot</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {current.label}
            </h1>
            <p className="mt-1 text-sm text-muted">{current.subtitle}</p>
          </div>
          <Link
            href="/"
            className="hidden text-sm text-muted hover:text-foreground sm:inline"
          >
            Marketing site
          </Link>
        </header>

        <div className="border-b border-line px-5 py-3 lg:px-8">
          <form className="flex flex-wrap items-center gap-3">
            {params.view ? <input type="hidden" name="view" value={params.view} /> : null}
            {params.store ? (
              <input type="hidden" name="store" value={params.store} />
            ) : null}
            <label className="sr-only" htmlFor="product-search">
              Filter products
            </label>
            <input
              id="product-search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Filter by title, store, brand"
              className="h-10 w-full max-w-md rounded-full border border-line bg-[#fafafa] px-4 text-sm outline-none ring-accent placeholder:text-muted focus:ring-2"
            />
          </form>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-b border-line px-5 py-3 lg:hidden">
          {SMART_VIEWS.map((item) => (
            <Link
              key={item.id}
              href={item.id === "all" ? "/dashboard" : `/dashboard?view=${item.id}`}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                view === item.id ? "bg-accent text-white" : "bg-[#f4f4f6] text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-5 py-6 lg:px-8">
          {products.length === 0 ? (
            <p className="text-sm text-muted">No products match these filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
