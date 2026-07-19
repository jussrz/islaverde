"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteGalleryImage, uploadGalleryImage } from "@/lib/storage";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  galleryImageMetaSchema,
} from "@/lib/validations/gallery";

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file");
  const parsed = galleryImageMetaSchema.safeParse({
    resortId: formData.get("resortId"),
    category: formData.get("category"),
    villaId: formData.get("villaId"),
    diningId: formData.get("diningId"),
    caption: formData.get("caption"),
  });

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/gallery?error=" + encodeURIComponent("Choose an image to upload"));
  }
  if (!parsed.success) {
    redirect("/admin/gallery?error=" + encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input"));
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    redirect("/admin/gallery?error=" + encodeURIComponent("Only JPEG, PNG, or WebP images are allowed"));
  }
  if (file.size > MAX_IMAGE_BYTES) {
    redirect("/admin/gallery?error=" + encodeURIComponent("Image must be under 5MB"));
  }

  const data = parsed.data;
  const { url, path } = await uploadGalleryImage(file);

  await prisma.galleryImage.create({
    data: {
      resortId: data.resortId,
      category: data.category,
      villaId: data.category === "VILLA" && data.villaId ? data.villaId : null,
      diningId: data.category === "DINING" && data.diningId ? data.diningId : null,
      caption: data.caption || null,
      url,
      path,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/villas");
  revalidatePath("/dining");
  redirect("/admin/gallery");
}

export async function deleteImageAction(imageId: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  if (image.path) {
    await deleteGalleryImage(image.path).catch(() => {
      // Row deletion still proceeds even if the storage object is already gone.
    });
  }

  await prisma.galleryImage.delete({ where: { id: imageId } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/villas");
  revalidatePath("/dining");
}
