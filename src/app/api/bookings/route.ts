import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validations/booking";
import { isVillaAvailable, nights } from "@/lib/availability";

const EXCLUSION_VIOLATION = "23P01";

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking details", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const villa = await prisma.villa.findUnique({ where: { id: data.villaId } });
  if (!villa) {
    return NextResponse.json({ error: "Villa not found" }, { status: 404 });
  }

  if (data.guests > villa.capacity) {
    return NextResponse.json(
      { error: `This villa sleeps a maximum of ${villa.capacity} guests` },
      { status: 400 },
    );
  }

  const range = { checkIn: data.checkIn, checkOut: data.checkOut };

  const available = await isVillaAvailable(villa.id, range);
  if (!available) {
    return NextResponse.json(
      { error: "This villa is no longer available for the selected dates" },
      { status: 409 },
    );
  }

  const session = await auth();
  const totalPrice = nights(range) * Number(villa.basePricePerNight);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          villaId: villa.id,
          status: { in: ["PENDING", "CONFIRMED"] },
          checkIn: { lt: data.checkOut },
          checkOut: { gt: data.checkIn },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new Error("BOOKING_CONFLICT");
      }

      return tx.booking.create({
        data: {
          userId: session?.user?.id,
          villaId: villa.id,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          paymentMethod: data.paymentMethod,
          guestNotes: data.guestNotes || null,
          totalPrice,
          status: "PENDING",
        },
      });
    });

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const isConflict =
      message === "BOOKING_CONFLICT" ||
      message.includes(EXCLUSION_VIOLATION) ||
      message.includes("no_overlapping_bookings");

    if (isConflict) {
      return NextResponse.json(
        { error: "This villa is no longer available for the selected dates" },
        { status: 409 },
      );
    }

    console.error("Failed to create booking", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
