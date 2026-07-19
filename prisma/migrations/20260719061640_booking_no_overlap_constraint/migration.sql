-- Prevent two active (PENDING/CONFIRMED) bookings from overlapping on the
-- same villa. This is the real guarantee against double-booking races —
-- the application-level check in POST /api/bookings is a fast pre-check,
-- but only this constraint is safe under concurrent requests.
--
-- Requires btree_gist for the composite equality + range-overlap exclusion.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING gist (
    "villaId" WITH =,
    daterange("checkIn", "checkOut", '[)') WITH &&
  )
  WHERE (status IN ('PENDING', 'CONFIRMED'));
