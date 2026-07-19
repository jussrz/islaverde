import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/villas", label: "Villas" },
  { href: "/admin/dining", label: "Dining" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/amenities", label: "Amenities" },
  { href: "/admin/bookings", label: "Bookings" },
];

export function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface">
      <nav className="sticky top-0 flex flex-col gap-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
