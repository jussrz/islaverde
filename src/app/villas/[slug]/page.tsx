import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingWidget } from "@/components/booking/BookingWidget";

export default async function VillaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const villa = await prisma.villa.findUnique({
    where: { slug },
    include: {
      amenities: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!villa) notFound();

  const [hero, ...rest] = villa.images;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
        {hero ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted sm:col-span-2 sm:row-span-2 sm:aspect-auto">
            <Image src={hero.url} alt={villa.name} fill className="object-cover" priority />
          </div>
        ) : null}
        {rest.slice(0, 2).map((img) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted sm:col-span-2"
          >
            <Image src={img.url} alt={img.caption ?? villa.name} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">{villa.name}</h1>
          <p className="mt-2 text-sm text-muted">
            Sleeps up to {villa.capacity} guests &middot; {villa.totalRooms} available
          </p>
          {villa.description ? (
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              {villa.description}
            </p>
          ) : null}

          {villa.amenities.length > 0 ? (
            <div className="mt-8">
              <h2 className="font-display text-xl text-foreground">Amenities</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {villa.amenities.map((amenity) => (
                  <li
                    key={amenity.id}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  >
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          <div className="sticky top-24">
            <BookingWidget
              villaId={villa.id}
              basePricePerNight={Number(villa.basePricePerNight)}
              capacity={villa.capacity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
