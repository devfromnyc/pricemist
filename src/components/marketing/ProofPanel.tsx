import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog/demo";
import { formatCents } from "@/lib/money";

export function ProofPanel({
  product,
  caption,
}: {
  product: CatalogProduct;
  caption: string;
}) {
  const advertised = product.metrics.advertisedDiscountPercent;
  const historical = product.metrics.historicalDiscountPercent;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:border-accent/40"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {caption}
      </p>
      <p className="mt-3 text-sm text-muted">{product.storeName}</p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight">{product.title}</h3>
      <p className="mt-4 text-3xl font-semibold tabular-nums">
        {formatCents(product.currentPriceCents)}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-[#f7f7f8] p-3">
          <dt className="text-xs text-muted">Advertised</dt>
          <dd className="mt-1 font-medium tabular-nums">
            {advertised !== null ? `${Math.round(advertised)}% off` : "No sale tag"}
          </dd>
        </div>
        <div className="rounded-2xl bg-[#f7f7f8] p-3">
          <dt className="text-xs text-muted">vs typical</dt>
          <dd className="mt-1 font-medium tabular-nums">
            {historical !== null
              ? `${Math.round(historical)}% below 90-day avg`
              : "Not enough history"}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
