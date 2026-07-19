import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DiningForm } from "@/components/admin/DiningForm";
import { updateDiningAction } from "../actions";

export default async function EditDiningPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [venue, resorts] = await Promise.all([
    prisma.dining.findUnique({ where: { id } }),
    prisma.resort.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!venue) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Edit dining venue</h1>
      <DiningForm
        action={updateDiningAction.bind(null, venue.id)}
        resorts={resorts}
        error={error}
        defaultValues={venue}
      />
    </div>
  );
}
