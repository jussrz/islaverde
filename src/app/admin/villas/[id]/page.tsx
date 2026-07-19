import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VillaForm } from "@/components/admin/VillaForm";
import { updateVillaAction } from "../actions";

export default async function EditVillaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [villa, resorts, amenities] = await Promise.all([
    prisma.villa.findUnique({ where: { id }, include: { amenities: true } }),
    prisma.resort.findMany({ orderBy: { name: "asc" } }),
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!villa) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Edit villa</h1>
      <VillaForm
        action={updateVillaAction.bind(null, villa.id)}
        resorts={resorts}
        amenities={amenities}
        error={error}
        defaultValues={{
          resortId: villa.resortId,
          name: villa.name,
          slug: villa.slug,
          description: villa.description,
          basePricePerNight: villa.basePricePerNight.toString(),
          capacity: villa.capacity,
          totalRooms: villa.totalRooms,
          amenityIds: villa.amenities.map((a) => a.id),
        }}
      />
    </div>
  );
}
