import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VillaCard } from "@/components/villas/VillaCard";

export default async function HomePage() {
  const [heroImage, featuredVillas] = await Promise.all([
    prisma.galleryImage.findFirst({
      where: { category: "RESORT" },
      orderBy: { order: "asc" },
    }),
    prisma.villa.findMany({
      take: 3,
      orderBy: { basePricePerNight: "desc" },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    }),
  ]);

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt="Islaverde Maldives"
            fill
            priority
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
          <p className="text-sm font-medium text-white/80">Islaverde Maldives</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl text-white sm:text-6xl">
            A private island, all to yourselves
          </h1>
          <p className="mt-4 max-w-xl text-white/85">
            Overwater villas, turquoise lagoons, and dining suspended above the reef. Find your
            stay at Islaverde.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/villas"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              View villas
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Explore gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Signature stays</p>
            <h2 className="mt-2 font-display text-3xl text-foreground">Featured villas</h2>
          </div>
          <Link href="/villas" className="text-sm font-medium text-primary hover:opacity-80">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredVillas.map((villa) => (
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
      </section>
    </div>
  );
}
