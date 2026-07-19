import { prisma } from "@/lib/prisma";
import { DiningForm } from "@/components/admin/DiningForm";
import { createDiningAction } from "../actions";

export default async function NewDiningPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const resorts = await prisma.resort.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Add dining venue</h1>
      <DiningForm action={createDiningAction} resorts={resorts} error={error} />
    </div>
  );
}
