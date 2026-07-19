import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [villaCount, diningCount, galleryCount, pendingCount, confirmedCount, upcoming] =
    await Promise.all([
      prisma.villa.count(),
      prisma.dining.count(),
      prisma.galleryImage.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.findMany({
        where: { status: { in: ["PENDING", "CONFIRMED"] }, checkIn: { gte: new Date() } },
        orderBy: { checkIn: "asc" },
        take: 5,
        include: { villa: true },
      }),
    ]);

  const revenue = await prisma.booking.aggregate({
    where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
    _sum: { totalPrice: true },
  });

  const stats = [
    { label: "Villas", value: villaCount },
    { label: "Dining venues", value: diningCount },
    { label: "Gallery images", value: galleryCount },
    { label: "Pending bookings", value: pendingCount },
    { label: "Confirmed bookings", value: confirmedCount },
    { label: "Revenue (confirmed)", value: formatCurrency(revenue._sum.totalPrice?.toString() ?? 0) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-1 font-display text-2xl text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-foreground">Upcoming check-ins</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No upcoming bookings.</p>
        ) : (
          <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
            {upcoming.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings`}
                className="flex items-center justify-between px-5 py-3 text-sm hover:bg-surface-muted"
              >
                <div>
                  <p className="font-medium text-foreground">{booking.guestName}</p>
                  <p className="text-muted">{booking.villa.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground">{formatDate(booking.checkIn)}</p>
                  <p className="text-muted">{booking.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
