"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const amenitySchema = z.object({
  name: z.string().trim().min(2).max(80),
  icon: z.string().trim().max(80).optional().or(z.literal("")),
});

export async function createAmenityAction(formData: FormData) {
  const parsed = amenitySchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon"),
  });
  if (!parsed.success) return;

  await prisma.amenity.create({
    data: { name: parsed.data.name, icon: parsed.data.icon || null },
  });
  revalidatePath("/admin/amenities");
}

export async function deleteAmenityAction(amenityId: string) {
  await prisma.amenity.delete({ where: { id: amenityId } });
  revalidatePath("/admin/amenities");
  revalidatePath("/admin/villas");
}
