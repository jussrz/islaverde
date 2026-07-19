import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/layout/UserMenu";

const links = [
  { href: "/villas", label: "Villas" },
  { href: "/dining", label: "Dining" },
  { href: "/gallery", label: "Gallery" },
  { href: "/search", label: "Search" },
];

export async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <header className="relative z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight text-primary"
        >
          Islaverde
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted sm:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link href="/admin" className="transition-colors hover:text-foreground">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserMenu
              name={session.user.name ?? null}
              email={session.user.email ?? null}
              isAdmin={isAdmin}
            />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Log in
            </Link>
          )}
          {!isAdmin ? (
            <Link
              href="/villas"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book a villa
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
