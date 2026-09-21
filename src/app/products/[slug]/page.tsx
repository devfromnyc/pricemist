import Link from "next/link";
import { notFound } from "next/navigation";
import { DealBadge } from "@/components/product/DealBadge";
import { dealBadge } from "@/lib/catalog/badges";
import { getDemoProduct } from "@/lib/catalog/demo";
import { formatCents } from "@/lib/money";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getDemoProduct(slug);
  if (!product) {
    notFound();
  }

  const badge = dealBadge(product);
  const advertised = product.metrics.advertisedDiscountPercent;
  const historical = product.metrics.historicalDiscountPercent;

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        <Link href="/dashboard" className="text-sm text-accent">
          Back to dashboard
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-3xl bg-[#f7f7f8]">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="aspect-square w-full object-contain p-12"
            />
          </div>

          <div>
            <p className="text-sm text-muted">{product.storeName}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {product.title}
            </h1>
            {badge ? (
              <div className="mt-3">
                <DealBadge label={badge.label} tone={badge.tone} />
              </div>
            ) : null}

            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-4xl font-semibold tabular-nums">
                {formatCents(product.currentPriceCents)}
              </p>
              {product.compareAtPriceCents ? (
                <p className="text-lg tabular-nums text-muted line-through">
                  {formatCents(product.compareAtPriceCents)}
                </p>
              ) : null}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-line p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  Advertised discount
                </p>
                <p className="mt-1 text-lg font-medium tabular-nums">
                  {advertised !== null ? `${Math.round(advertised)}% off` : "None"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  vs 90-day average
                </p>
                <p className="mt-1 text-lg font-medium tabular-nums">
                  {historical !== null
                    ? `${Math.round(historical)}% below typical`
                    : "Not enough history"}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">30-day average</dt>
                <dd className="mt-1 tabular-nums font-medium">
                  {product.metrics.average30Cents
                    ? formatCents(product.metrics.average30Cents)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">90-day average</dt>
                <dd className="mt-1 tabular-nums font-medium">
                  {product.metrics.average90Cents
                    ? formatCents(product.metrics.average90Cents)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Historical low</dt>
                <dd className="mt-1 tabular-nums font-medium">
                  {formatCents(product.metrics.historicalLowCents)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Historical high</dt>
                <dd className="mt-1 tabular-nums font-medium">
                  {formatCents(product.metrics.historicalHighCents)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Days at current price</dt>
                <dd className="mt-1 tabular-nums font-medium">
                  {product.metrics.daysAtCurrentPrice}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="mt-1 font-medium">{badge?.label ?? "Stable"}</dd>
              </div>
            </dl>

            <p className="mt-8 text-sm text-muted">
              Price history chart comes next. These numbers are already real
              demo math, not AI guesses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
