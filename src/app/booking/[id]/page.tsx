import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending confirmation",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-slate-100 text-slate-700",
};

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { villa: true },
  });

  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[booking.status]}`}
      >
        {STATUS_LABEL[booking.status]}
      </span>
      <h1 className="mt-4 font-display text-3xl text-foreground">Thank you, {booking.guestName.split(" ")[0]}</h1>
      <p className="mt-2 text-muted">
        Your reservation at <span className="text-foreground">{booking.villa.name}</span> has
        been received. Save this page&apos;s link — it&apos;s your booking reference.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Booking ID</span>
          <span className="font-mono text-foreground">{booking.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Villa</span>
          <span className="text-foreground">{booking.villa.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Check-in</span>
          <span className="text-foreground">{formatDate(booking.checkIn)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Check-out</span>
          <span className="text-foreground">{formatDate(booking.checkOut)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Guests</span>
          <span className="text-foreground">{booking.guests}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted">Total</span>
          <span className="font-medium text-foreground">
            {formatCurrency(booking.totalPrice.toString())}
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/villas"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
        >
          Browse more villas
        </Link>
      </div>
    </div>
  );
}
