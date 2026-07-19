import { prisma } from "@/lib/prisma";
import { DiningCard } from "@/components/dining/DiningCard";

export const metadata = {
  title: "Dining — Islaverde Resorts",
};

export default async function DiningPage() {
  const venues = await prisma.dining.findMany({
    orderBy: { name: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-primary">Dining</p>
      <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
        Restaurants &amp; bars
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        From overwater fine dining to beachside grills, every meal comes with a view.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <DiningCard
            key={venue.id}
            slug={venue.slug}
            name={venue.name}
            description={venue.description}
            cuisineType={venue.cuisineType}
            openingHours={venue.openingHours}
            imageUrl={venue.images[0]?.url}
          />
        ))}
      </div>
    </div>
  );
}
