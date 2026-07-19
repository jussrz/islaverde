import { z } from "zod";

export const diningSchema = z.object({
  resortId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  cuisineType: z.string().trim().max(120).optional().or(z.literal("")),
  openingHours: z.string().trim().max(120).optional().or(z.literal("")),
});

export type DiningInput = z.infer<typeof diningSchema>;
