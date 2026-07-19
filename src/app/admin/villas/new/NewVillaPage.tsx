import { prisma } from "@/lib/prisma";
import { VillaForm } from "@/components/admin/VillaForm";
import { createVillaAction } from "../actions";

export default async function NewVillaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [resorts, amenities] = await Promise.all([
    prisma.resort.findMany({ orderBy: { name: "asc" } }),
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Add villa</h1>
      <VillaForm action={createVillaAction} resorts={resorts} amenities={amenities} error={error} />
    </div>
  );
}
