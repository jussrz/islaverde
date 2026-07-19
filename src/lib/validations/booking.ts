import { z } from "zod";

const PAYMENT_METHODS = ["CREDIT_CARD", "GCASH", "PAYMAYA", "BANK_TRANSFER", "PAY_AT_RESORT"] as const;

export const createBookingSchema = z
  .object({
    villaId: z.string().cuid2().or(z.string().min(1)),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: z.coerce.number().int().min(1).max(50),
    guestName: z.string().trim().min(2, "Enter your full name").max(120),
    guestEmail: z.string().trim().email("Enter a valid email"),
    guestPhone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number")
      .max(20)
      .regex(/^[0-9+()\-\s]+$/, "Enter a valid phone number"),
    paymentMethod: z.enum(PAYMENT_METHODS),
    guestNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.checkIn >= today;
    },
    { message: "Check-in cannot be in the past", path: ["checkIn"] },
  );

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const bookingStatusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);
