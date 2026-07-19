import { z } from "zod";

export const villaSchema = z.object({
  resortId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  basePricePerNight: z.coerce.number().positive().max(1_000_000),
  capacity: z.coerce.number().int().min(1).max(50),
  totalRooms: z.coerce.number().int().min(1).max(999).default(1),
  amenityIds: z.array(z.string()).default([]),
});

export type VillaInput = z.infer<typeof villaSchema>;
