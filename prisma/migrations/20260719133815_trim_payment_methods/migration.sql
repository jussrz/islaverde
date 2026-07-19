-- Trim PaymentMethod to CREDIT_CARD and PAYPAL only. Postgres can't drop
-- enum values directly, so recreate the type: build the new enum, cast the
-- column across (any remaining old values were migrated to CREDIT_CARD by
-- a one-off data fix before this ran), then swap the old type out.
BEGIN;

CREATE TYPE "PaymentMethod_new" AS ENUM ('CREDIT_CARD', 'PAYPAL');

ALTER TABLE "Booking"
  ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new"
  USING ("paymentMethod"::text::"PaymentMethod_new");

DROP TYPE "PaymentMethod";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";

COMMIT;
