import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { updateBookingStatusAction } from "./actions";

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = STATUSES.includes(status as (typeof STATUSES)[number])
    ? (status as (typeof STATUSES)[number])
    : "ALL";

  const bookings = await prisma.booking.findMany({
    where: activeStatus === "ALL" ? {} : { status: activeStatus },
    orderBy: { createdAt: "desc" },
    include: { villa: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Bookings</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/bookings" : `/admin/bookings?status=${s}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              activeStatus === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted hover:text-foreground",
            )}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Villa</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="text-foreground">{booking.guestName}</p>
                  <p className="text-xs text-muted">{booking.guestEmail}</p>
                </td>
                <td className="px-4 py-3 text-foreground">{booking.villa.name}</td>
                <td className="px-4 py-3 text-foreground">
                  {formatDate(booking.checkIn)} &ndash; {formatDate(booking.checkOut)}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {formatCurrency(booking.totalPrice.toString())}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={updateBookingStatusAction.bind(null, booking.id)}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="status"
                      defaultValue={booking.status}
                      className="rounded-md border border-border bg-transparent px-2 py-1 text-xs"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-foreground hover:opacity-80"
                    >
                      Update
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/booking/${booking.id}`} className="text-primary hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No bookings.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
