import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata = {
  title: "Gallery — Islaverde Resorts",
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: { id: true, url: true, caption: true, category: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-primary">Gallery</p>
      <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
        A closer look at Islaverde
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Villas, dining, and the island itself — browse by category.
      </p>

      <div className="mt-10">
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
