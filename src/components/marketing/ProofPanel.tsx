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
  const typical = product.metrics.average90Cents;
  const low = product.metrics.historicalLowCents;

  return (
    <Link href={`/products/${product.slug}`} className="hangtag block transition hover:-translate-y-1">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
        {caption}
      </p>
      <p className="mt-5 text-sm text-muted">{product.storeName}</p>
      <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl leading-tight">
        {product.title}
      </h3>
      <p className="mt-5 font-mono text-4xl tabular-nums tracking-tight">
        {formatCents(product.currentPriceCents)}
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">
            90-day typical
          </dt>
          <dd className="mt-1 font-mono text-lg">
            {typical !== null ? formatCents(typical) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">
            Historical low
          </dt>
          <dd className="mt-1 font-mono text-lg text-accent">{formatCents(low)}</dd>
        </div>
      </dl>
    </Link>
  );
}
