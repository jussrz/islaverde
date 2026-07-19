import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <p className="font-display text-lg text-primary">Islaverde</p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              A private island escape — overwater and beachfront villas, fine dining, and
              turquoise lagoons.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-foreground">Explore</span>
              <Link href="/villas" className="text-muted hover:text-foreground">Villas</Link>
              <Link href="/dining" className="text-muted hover:text-foreground">Dining</Link>
              <Link href="/gallery" className="text-muted hover:text-foreground">Gallery</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-foreground">Account</span>
              <Link href="/login" className="text-muted hover:text-foreground">Log in</Link>
              <Link href="/account" className="text-muted hover:text-foreground">My bookings</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          &copy; {new Date().getFullYear()} Islaverde Resorts. Portfolio project — not a real booking service.
        </div>
      </div>
    </footer>
  );
}
