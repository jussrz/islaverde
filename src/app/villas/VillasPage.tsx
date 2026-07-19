import { prisma } from "@/lib/prisma";
import { VillaCard } from "@/components/villas/VillaCard";

export const metadata = {
  title: "Villas — Islaverde Resorts",
};

export default async function VillasPage() {
  const villas = await prisma.villa.findMany({
    orderBy: { basePricePerNight: "asc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-primary">Accommodation</p>
      <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
        Villas &amp; suites
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Overwater and beachfront villas, each with direct lagoon access and uninterrupted ocean
        views.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
