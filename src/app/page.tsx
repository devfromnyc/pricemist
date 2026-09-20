export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6">
      <main className="w-full max-w-lg text-center">
        <p className="text-sm font-medium text-accent">PriceMist</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          See which sales are actually good deals.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Historical prices and math decide. AI only explains. The dashboard
          comes next.
        </p>
      </main>
    </div>
  );
}
