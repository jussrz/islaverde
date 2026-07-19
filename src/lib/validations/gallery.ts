import { z } from "zod";

export const galleryCategorySchema = z.enum(["VILLA", "DINING", "RESORT", "ACTIVITIES"]);

export const galleryImageMetaSchema = z.object({
  resortId: z.string().min(1),
  category: galleryCategorySchema,
  villaId: z.string().optional().or(z.literal("")),
  diningId: z.string().optional().or(z.literal("")),
  caption: z.string().trim().max(200).optional().or(z.literal("")),
});

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
