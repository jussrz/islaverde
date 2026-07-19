import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DiningDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const venue = await prisma.dining.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!venue) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {venue.images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted"
          >
            <Image
              src={img.url}
              alt={img.caption ?? venue.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">{venue.name}</h1>
          {venue.cuisineType ? (
            <span className="rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-muted">
              {venue.cuisineType}
            </span>
          ) : null}
        </div>
        {venue.openingHours ? (
          <p className="mt-2 text-sm text-muted">{venue.openingHours}</p>
        ) : null}
        {venue.description ? (
          <p className="mt-6 text-base leading-relaxed text-foreground/90">{venue.description}</p>
        ) : null}
      </div>
    </div>
  );
}
