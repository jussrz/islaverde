"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { villaSchema } from "@/lib/validations/villa";

function parseVillaForm(formData: FormData) {
  return villaSchema.safeParse({
    resortId: formData.get("resortId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    basePricePerNight: formData.get("basePricePerNight"),
    capacity: formData.get("capacity"),
    totalRooms: formData.get("totalRooms"),
    amenityIds: formData.getAll("amenityIds"),
  });
}

export async function createVillaAction(formData: FormData) {
  const parsed = parseVillaForm(formData);
  if (!parsed.success) {
    redirect(`/admin/villas/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const data = parsed.data;
  await prisma.villa.create({
    data: {
      resortId: data.resortId,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      basePricePerNight: data.basePricePerNight,
      capacity: data.capacity,
      totalRooms: data.totalRooms,
      amenities: { connect: data.amenityIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/villas");
  revalidatePath("/villas");
  redirect("/admin/villas");
}

export async function updateVillaAction(villaId: string, formData: FormData) {
  const parsed = parseVillaForm(formData);
  if (!parsed.success) {
    redirect(
      `/admin/villas/${villaId}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const data = parsed.data;
  await prisma.villa.update({
    where: { id: villaId },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      basePricePerNight: data.basePricePerNight,
      capacity: data.capacity,
      totalRooms: data.totalRooms,
      amenities: { set: data.amenityIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/villas");
  revalidatePath("/villas");
  revalidatePath(`/villas/${data.slug}`);
  redirect("/admin/villas");
}

export async function deleteVillaAction(villaId: string) {
  await prisma.villa.delete({ where: { id: villaId } });
  revalidatePath("/admin/villas");
  revalidatePath("/villas");
}
