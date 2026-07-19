import { NextRequest, NextResponse } from "next/server";
import { isVillaAvailable } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const villaId = searchParams.get("villaId");
  const checkInRaw = searchParams.get("checkIn");
  const checkOutRaw = searchParams.get("checkOut");

  if (!villaId || !checkInRaw || !checkOutRaw) {
    return NextResponse.json(
      { error: "villaId, checkIn, and checkOut are required" },
      { status: 400 },
    );
  }

  const checkIn = new Date(checkInRaw);
  const checkOut = new Date(checkOutRaw);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const available = await isVillaAvailable(villaId, { checkIn, checkOut });
  return NextResponse.json({ available });
}
