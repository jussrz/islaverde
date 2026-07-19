import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { deleteImageAction } from "./actions";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const resort = await prisma.resort.findFirst({ orderBy: { createdAt: "asc" } });
  const [villas, dinings, images] = await Promise.all([
    prisma.villa.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.dining.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.galleryImage.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
      include: { villa: { select: { name: true } }, dining: { select: { name: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Gallery</h1>

      {error ? (
        <p className="mt-4 max-w-xl rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {resort ? (
        <div className="mt-6">
          <GalleryUploadForm resortId={resort.id} villas={villas} dinings={dinings} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Create a resort before uploading images.</p>
      )}

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="relative aspect-[4/3] w-full bg-surface-muted">
              <Image src={img.url} alt={img.caption ?? ""} fill className="object-cover" />
            </div>
            <div className="p-3 text-xs text-muted">
              <p className="font-medium text-foreground">{img.category}</p>
              {img.villa ? <p>{img.villa.name}</p> : null}
              {img.dining ? <p>{img.dining.name}</p> : null}
              {img.caption ? <p className="mt-1">{img.caption}</p> : null}
              <form action={deleteImageAction.bind(null, img.id)} className="mt-2">
                <button type="submit" className="text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {images.length === 0 ? (
          <p className="col-span-full text-sm text-muted">No images yet.</p>
        ) : null}
      </div>
    </div>
  );
}
