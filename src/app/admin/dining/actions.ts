"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { diningSchema } from "@/lib/validations/dining";

function parseDiningForm(formData: FormData) {
  return diningSchema.safeParse({
    resortId: formData.get("resortId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    cuisineType: formData.get("cuisineType"),
    openingHours: formData.get("openingHours"),
  });
}

export async function createDiningAction(formData: FormData) {
  const parsed = parseDiningForm(formData);
  if (!parsed.success) {
    redirect(`/admin/dining/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const data = parsed.data;
  await prisma.dining.create({
    data: {
      resortId: data.resortId,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      cuisineType: data.cuisineType || null,
      openingHours: data.openingHours || null,
    },
  });

  revalidatePath("/admin/dining");
  revalidatePath("/dining");
  redirect("/admin/dining");
}

export async function updateDiningAction(diningId: string, formData: FormData) {
  const parsed = parseDiningForm(formData);
  if (!parsed.success) {
    redirect(
      `/admin/dining/${diningId}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const data = parsed.data;
  await prisma.dining.update({
    where: { id: diningId },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      cuisineType: data.cuisineType || null,
      openingHours: data.openingHours || null,
    },
  });

  revalidatePath("/admin/dining");
  revalidatePath("/dining");
  revalidatePath(`/dining/${data.slug}`);
  redirect("/admin/dining");
}

export async function deleteDiningAction(diningId: string) {
  await prisma.dining.delete({ where: { id: diningId } });
  revalidatePath("/admin/dining");
  revalidatePath("/dining");
}
