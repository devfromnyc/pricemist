import Link from "next/link";
import { dealBadge } from "@/lib/catalog/badges";
import type { CatalogProduct } from "@/lib/catalog/demo";
import { formatCents } from "@/lib/money";
import { DealBadge } from "./DealBadge";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const badge = dealBadge(product);
  const compareAt = product.compareAtPriceCents;
  const showCompare =
    compareAt !== null && compareAt > product.currentPriceCents;

  return (
    <article>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-paper">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="aspect-square w-full object-contain p-8 transition duration-200 group-hover:scale-[1.02]"
          />
          {badge ? (
            <div className="absolute left-3 top-3">
              <DealBadge label={badge.label} tone={badge.tone} />
            </div>
          ) : null}
        </div>
        <div className="px-1 pt-3">
          <h2 className="truncate text-sm font-medium text-foreground">
            {product.title}
          </h2>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="font-mono text-[22px] tabular-nums tracking-tight">
              {formatCents(product.currentPriceCents)}
            </p>
            {showCompare ? (
              <p className="text-sm tabular-nums text-muted line-through">
                {formatCents(compareAt)}
              </p>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted">{product.storeName}</p>
        </div>
      </Link>
    </article>
  );
}
