"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { bookingStatusSchema } from "@/lib/validations/booking";

export async function updateBookingStatusAction(bookingId: string, formData: FormData) {
  const parsed = bookingStatusSchema.safeParse(formData.get("status"));
  if (!parsed.success) return;

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  revalidatePath(`/booking/${bookingId}`);
}
