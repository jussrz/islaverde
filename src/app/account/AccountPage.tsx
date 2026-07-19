import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) return null; // unreachable: middleware protects this route

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { villa: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-foreground">My bookings</h1>

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-muted">You haven&apos;t made any bookings yet.</p>
          <Link
            href="/villas"
            className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Browse villas
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/booking/${booking.id}`}
              className="block rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-foreground">{booking.villa.name}</span>
                <span className="text-sm font-medium text-primary">
                  {formatCurrency(booking.totalPrice.toString())}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {formatDate(booking.checkIn)} &ndash; {formatDate(booking.checkOut)} &middot;{" "}
                {booking.status}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
