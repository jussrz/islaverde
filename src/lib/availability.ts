import { prisma } from "@/lib/prisma";

export type DateRange = { checkIn: Date; checkOut: Date };

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED"] as const;

/**
 * Half-open interval overlap test: [checkIn, checkOut). A checkout on the
 * same day as another booking's checkin does NOT count as an overlap.
 */
export function rangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.checkIn < b.checkOut && a.checkOut > b.checkIn;
}

export function nights(range: DateRange): number {
  const ms = range.checkOut.getTime() - range.checkIn.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Fast pre-check used before attempting to write a booking. This is NOT the
 * source of truth under concurrency — the `no_overlapping_bookings` Postgres
 * EXCLUDE constraint (see prisma/migrations) is what actually prevents a
 * race between two simultaneous booking requests. This function exists to
 * return a clean validation error in the common (non-racing) case instead of
 * relying solely on catching a raw DB constraint-violation error.
 */
export async function isVillaAvailable(
  villaId: string,
  range: DateRange,
  excludeBookingId?: string,
): Promise<boolean> {
  const conflict = await prisma.booking.findFirst({
    where: {
      villaId,
      status: { in: [...ACTIVE_STATUSES] },
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      checkIn: { lt: range.checkOut },
      checkOut: { gt: range.checkIn },
    },
    select: { id: true },
  });

  return conflict === null;
}
