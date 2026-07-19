import { prisma } from "@/lib/prisma";
import { VillaCard } from "@/components/villas/VillaCard";

export const metadata = {
  title: "Search availability — Islaverde Resorts",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const params = await searchParams;
  const checkIn = params.checkIn ? new Date(params.checkIn) : null;
  const checkOut = params.checkOut ? new Date(params.checkOut) : null;
  const guests = params.guests ? Number(params.guests) : 1;

  const hasValidRange =
    checkIn && checkOut && !Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime()) && checkOut > checkIn;

  const villas = await prisma.villa.findMany({
    where: {
      capacity: { gte: guests },
      ...(hasValidRange
        ? {
            bookings: {
              none: {
                status: { in: ["PENDING", "CONFIRMED"] },
                checkIn: { lt: checkOut! },
                checkOut: { gt: checkIn! },
              },
            },
          }
        : {}),
    },
    orderBy: { basePricePerNight: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-primary">Search</p>
      <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
        Check availability
      </h1>

      <form className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-4">
        <div>
          <label htmlFor="checkIn" className="text-xs font-medium text-muted">
            Check-in
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            defaultValue={params.checkIn}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="checkOut" className="text-xs font-medium text-muted">
            Check-out
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            defaultValue={params.checkOut}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="guests" className="text-xs font-medium text-muted">
            Guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            defaultValue={params.guests ?? "1"}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-muted">
        {hasValidRange
          ? `${villas.length} villa${villas.length === 1 ? "" : "s"} available`
          : "Showing all villas — pick dates to check availability"}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {villas.map((villa) => (
          <VillaCard
            key={villa.id}
            slug={villa.slug}
            name={villa.name}
            description={villa.description}
            basePricePerNight={villa.basePricePerNight.toString()}
            capacity={villa.capacity}
            imageUrl={villa.images[0]?.url}
          />
        ))}
      </div>
    </div>
  );
}
