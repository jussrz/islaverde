import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Resort booking &amp; management</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Find your stay at Islaverde
        </h1>
        <p className="mt-4 text-lg text-muted">
          Browse rooms, check real-time availability, and book your next getaway.
          This project is under active development.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/search"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Search availability
          </Link>
          <Link
            href="/resorts"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            View resorts
          </Link>
        </div>
      </div>
    </div>
  );
}
