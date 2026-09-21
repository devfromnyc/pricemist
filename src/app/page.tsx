import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { ProofPanel } from "@/components/marketing/ProofPanel";
import { getDemoProducts } from "@/lib/catalog/demo";

const features = [
  {
    title: "Advertised discount vs historical discount",
    body: "Retailers publish a compare-at price. PriceMist also measures the current price against the 90-day average, so a 40% off tag can still come back as “this isn’t unusual.”",
  },
  {
    title: "New historical lows, when they are actually new",
    body: "A product sitting at $60 for months is not a new low. One that just dropped to the cheapest recorded price is. The labels come from rules, not a model.",
  },
  {
    title: "Biggest drops you can explain",
    body: "Percentage change, previous price, and days at the current price are calculated from stored observations. If we cannot show the math, we do not show the badge.",
  },
  {
    title: "Stores you actually care about",
    body: "The demo follows Carter’s, lululemon, Nike, and Target as snapshot catalogs. The product is built so another store is an adapter, not a rewrite.",
  },
];

const steps = [
  {
    step: "01",
    title: "Open the demo",
    body: "No account. Forty products with six months of price history already loaded.",
  },
  {
    step: "02",
    title: "Pick a Smart View",
    body: "Today’s Deals, Historical Lows, Biggest Drops, or Sale But Not Unusual.",
  },
  {
    step: "03",
    title: "Read the history",
    body: "Open a product. Compare the sale tag with the 30-day and 90-day averages.",
  },
];

export default function LandingPage() {
  const products = getDemoProducts();
  const fakeSale = products.find(
    (product) => product.metrics.status === "SALE_BUT_NOT_UNUSUAL",
  );
  const historicalLow = products.find(
    (product) => product.metrics.status === "HISTORICAL_LOW",
  );
  const unusualCount = products.filter(
    (product) => product.metrics.status === "SALE_BUT_NOT_UNUSUAL",
  ).length;
  const lowCount = products.filter(
    (product) => product.metrics.status === "HISTORICAL_LOW",
  ).length;

  return (
    <div className="min-h-dvh bg-white">
      <MarketingHeader />

      <section className="grid min-h-[calc(100svh-57px)] lg:grid-cols-2">
        <div
          id="main"
          className="flex flex-col justify-end px-4 py-16 sm:px-8 lg:px-12 lg:py-20"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
            Deal intelligence · price history · not an AI score
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The tag says 40% off. The history might disagree.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted">
            PriceMist tracks products across stores and tells you whether an
            advertised sale is actually cheap versus its own past. Math first.
            The hosted demo is a snapshot — not a live scrape of Nike or Target.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white"
            >
              Open demo
            </Link>
            <Link
              href="/#proof"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium"
            >
              See the difference
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 border-t border-line bg-[#fafafa] px-4 py-12 sm:px-8 lg:border-t-0 lg:border-l lg:px-12">
          {fakeSale ? (
            <ProofPanel
              product={fakeSale}
              caption="Advertised sale · historically normal"
            />
          ) : null}
          {historicalLow ? (
            <ProofPanel
              product={historicalLow}
              caption="New historical low"
            />
          ) : null}
        </div>
      </section>

      <section
        id="proof"
        className="scroll-mt-16 border-t border-line bg-[#fafafa]"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold tabular-nums">{products.length}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Demo products across Carter’s, lululemon, Nike, and Target, each
              with months of daily prices.
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold tabular-nums">{unusualCount}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Currently tagged as a sale that is not unusual — the advertised
              markdown is close to the recent average.
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold tabular-nums">{lowCount}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              At a recorded historical low in this snapshot. Counted from
              stored prices, not from the retailer’s “was” number.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Follow stores. Keep history. Trust the math.
          </h2>
        </div>
        <div className="border-t border-line">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="mx-auto grid max-w-6xl gap-6 border-b border-line px-4 py-10 sm:px-6 lg:grid-cols-[8rem_minmax(0,1fr)]"
            >
              <p className="font-mono text-sm text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-muted">{feature.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid border-b border-line md:grid-cols-3">
        {steps.map((item, index) => (
          <div
            key={item.step}
            className={`px-6 py-12 ${index > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""}`}
          >
            <p className="font-mono text-[11px] tracking-[0.2em] text-accent">
              {item.step}
            </p>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-foreground px-4 py-20 text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
            Try it
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Open the demo. See a fake sale next to a real low.
          </h2>
          <p className="mt-6 max-w-lg text-white/70">
            No signup. The dashboard is the product. Gemini is not required —
            and it never decides whether a deal is good.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white"
            >
              Open demo
            </Link>
            <a
              href="https://github.com/devfromnyc/pricemist"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white"
            >
              View the code
            </a>
          </div>
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm font-semibold">Pricemist</p>
        <p className="text-xs text-muted">
          Advertised discount vs historical discount · demo snapshot
        </p>
      </footer>
    </div>
  );
}
