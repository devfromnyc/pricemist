import Image from "next/image";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { ParallaxHero } from "@/components/marketing/ParallaxHero";
import { ProofPanel } from "@/components/marketing/ProofPanel";
import { getDemoProducts } from "@/lib/catalog/demo";
import { siteName } from "@/lib/site";

const features = [
  {
    title: "Months of prices. One honest number.",
    body: "Every product in the demo carries 180 days of history. Typical, high, and low are computed from that set — not from whatever the store printed this morning.",
    image: "/images/marketing/look-loafers.jpg",
    alt: "Cognac leather loafers on marble",
  },
  {
    title: "The best deals, already ranked.",
    body: "Historical lows, near-lows, and the biggest drops sit at the front of the floor. You do not hunt through a catalog hoping something is cheap. The cheap things find you.",
    image: "/images/marketing/look-shades.jpg",
    alt: "Gold sunglasses on a cream marble surface",
  },
  {
    title: "Buy when the price is actually yours.",
    body: "A number you like is only a deal if it just arrived. Sitting there for a month is the everyday price. Hitting the low this week is the moment.",
    image: "/images/marketing/look-messenger.jpg",
    alt: "A terracotta leather messenger bag in studio light",
  },
];

export default function LandingPage() {
  const products = getDemoProducts();
  const buyNow = products.find(
    (product) => product.metrics.status === "HISTORICAL_LOW",
  );
  const almost = products.find(
    (product) =>
      product.metrics.status === "NEAR_HISTORICAL_LOW" &&
      product.slug !== buyNow?.slug,
  );
  const dealCount = products.filter(
    (product) =>
      product.metrics.status === "HISTORICAL_LOW" ||
      product.metrics.status === "NEAR_HISTORICAL_LOW" ||
      product.metrics.status === "SIGNIFICANT_DROP",
  ).length;
  const lowCount = products.filter(
    (product) => product.metrics.status === "HISTORICAL_LOW",
  ).length;

  return (
    <div className="marketing min-h-dvh overflow-x-hidden">
      <ParallaxHero
        src="/images/marketing/hero-bag.jpg"
        cutoutSrc="/images/marketing/hero-bag.png"
        alt="A woven cognac leather bag"
      >
        <MarketingHeader />
        <div
          id="main"
          className="relative mx-auto flex w-full max-w-[1400px] flex-col px-4 pb-2 pt-24 sm:px-8 lg:min-h-[100svh] lg:px-12 lg:pb-10 lg:pt-28"
        >
          <div className="max-w-2xl lg:mt-auto">
            <p className="max-w-xl text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Historical prices for the products you already want
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[2.75rem] leading-[0.92] text-foreground sm:mt-5 sm:text-7xl lg:text-[6.2rem]">
              Buy at the
              <br />
              perfect <em>moment</em>.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted sm:mt-6 sm:text-lg">
              {siteName} keeps the history, ranks the best deals, and shows you
              when the number is actually yours. This page is a working demo of
              software you can also run on your own computer.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link
                href="/dashboard?view=deals"
                className="inline-block bg-[#1e1812] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7f1e6]"
              >
                See today's deals
              </Link>
            </div>
          </div>
        </div>
      </ParallaxHero>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            On the floor
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.05] sm:text-5xl">
            One is at the low. The other is almost there.
          </h2>
          <p className="mt-5 text-muted">
            Same catalog. Different moments. These cards are ranked from the
            demo history, not written by a model.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {buyNow ? <ProofPanel product={buyNow} caption="Buy now" /> : null}
          {almost ? <ProofPanel product={almost} caption="Almost" /> : null}
        </div>
      </section>

      <section
        id="proof"
        className="mx-4 border border-line bg-paper sm:mx-8"
      >
        <div className="grid md:grid-cols-3">
          {[
            {
              value: "180",
              label: "Days of price history behind every product in the snapshot.",
            },
            {
              value: String(dealCount),
              label: "Deals worth a look right now — lows, near-lows, and real drops.",
            },
            {
              value: String(lowCount),
              label: "At the cheapest recorded price. That is the moment to buy.",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-b border-line px-6 py-10 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className="font-[family-name:var(--font-display)] text-5xl">{stat.value}</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-[1400px] scroll-mt-10 px-4 py-16 sm:px-8 lg:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          How it works
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] sm:text-5xl">
          A lookbook for the price, not the poster.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efece7]">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl leading-tight">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="setup"
        className="mx-auto max-w-[1400px] scroll-mt-10 px-4 pb-16 sm:px-8 lg:pb-24"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          On your computer
        </p>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] sm:text-5xl">
          The website is the showroom. The product is software.
        </h2>
        <p className="mt-5 max-w-xl text-muted">
          You can walk the floor in this browser right now. If you want a copy
          on your own machine — for a portfolio review, a client walkthrough, or
          just to keep it — I set it up with you. You do not need to know what a
          terminal is.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          <article className="bg-paper px-6 py-8 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Try it here
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl">
              Open the live demo
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              No account. Same history, same math, in this browser. Click
              through deals and product pages the way a shopper would.
            </p>
            <Link
              href="/dashboard?view=deals"
              className="mt-6 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              See today's deals
            </Link>
          </article>
          <article className="bg-paper px-6 py-8 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Keep a copy
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl">
              I install it on your computer
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              The technical steps stay on my side. We sit down, I get it running
              on your machine, and you have the same Doubletake you see here —
              without learning any developer tools.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-4 mb-8 grid overflow-hidden border border-line bg-paper lg:mx-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-end px-5 py-12 sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            Walk the floor
          </p>
          <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.02] sm:text-5xl">
            Open the demo. Pick a price. Wait for the low.
          </h2>
          <p className="mt-5 max-w-md text-muted">
            No signup. History decides the deal.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard?view=deals"
              className="inline-block bg-accent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-background"
            >
              See today's deals
            </Link>
          </div>
        </div>
        <div className="relative min-h-[320px] bg-[#efece7]">
          <Image
            src="/images/marketing/look-still.jpg"
            alt="A cognac leather bag on a cream table"
            fill
            className="object-cover object-[center_40%]"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-8">
        <p className="font-[family-name:var(--font-display)]">{siteName}</p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          Historical prices · best deals · buy at the low
        </p>
      </footer>
    </div>
  );
}
