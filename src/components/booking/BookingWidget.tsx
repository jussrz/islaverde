"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "CREDIT_CARD" | "PAYPAL";

// Local form shape (native <input type="date"> values are plain strings).
// The authoritative shape/coercion lives server-side in
// lib/validations/booking.ts — this form only needs enough client-side
// validation for a good UX; the server re-validates everything on submit.
type BookingFormValues = {
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  paymentMethod: PaymentMethod;
  guestNotes?: string;
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CREDIT_CARD", label: "Credit / Debit Card" },
  { value: "PAYPAL", label: "PayPal" },
];

export function BookingWidget({
  villaId,
  basePricePerNight,
  capacity,
  defaultGuestName,
  defaultGuestEmail,
}: {
  villaId: string;
  basePricePerNight: number;
  capacity: number;
  defaultGuestName?: string;
  defaultGuestEmail?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: {
      guests: 1,
      paymentMethod: "CREDIT_CARD",
      guestName: defaultGuestName ?? "",
      guestEmail: defaultGuestEmail ?? "",
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const { nights, total } = useMemo(() => {
    if (!checkIn || !checkOut) return { nights: 0, total: 0 };
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    const n = diff > 0 ? diff : 0;
    return { nights: n, total: n * basePricePerNight };
  }, [checkIn, checkOut, basePricePerNight]);

  const onSubmit = async (data: BookingFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, villaId }),
      });

      const body = await res.json();

      if (!res.ok) {
        setServerError(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      toast.success("Villa reserved!");
      router.push(`/booking/${body.id}`);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-2xl text-foreground">
          {formatCurrency(basePricePerNight)}
        </span>
        <span className="text-sm text-muted">/ night</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="checkIn" className="text-xs font-medium text-muted">
            Check-in
          </label>
          <input
            id="checkIn"
            type="date"
            {...register("checkIn", { required: "Required" })}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
          {errors.checkIn ? (
            <p className="mt-1 text-xs text-red-600">{errors.checkIn.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="checkOut" className="text-xs font-medium text-muted">
            Check-out
          </label>
          <input
            id="checkOut"
            type="date"
            {...register("checkOut", { required: "Required" })}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
          {errors.checkOut ? (
            <p className="mt-1 text-xs text-red-600">{errors.checkOut.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="guests" className="text-xs font-medium text-muted">
          Guests
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          max={capacity}
          {...register("guests", { required: true, valueAsNumber: true, min: 1, max: capacity })}
          className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        {errors.guests ? (
          <p className="mt-1 text-xs text-red-600">Enter a number between 1 and {capacity}</p>
        ) : (
          <p className="mt-1 text-xs text-muted">Max {capacity} guests</p>
        )}
      </div>

      {nights > 0 ? (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-sm">
          <span className="text-muted">
            {formatCurrency(basePricePerNight)} &times; {nights} night{nights > 1 ? "s" : ""}
          </span>
          <span className="font-medium text-foreground">{formatCurrency(total)}</span>
        </div>
      ) : null}

      <div className="mt-5 space-y-3 border-t border-border pt-5">
        <div>
          <label htmlFor="guestName" className="text-xs font-medium text-muted">
            Full name
          </label>
          <input
            id="guestName"
            type="text"
            readOnly={Boolean(defaultGuestName)}
            {...register("guestName", { required: "Enter your full name" })}
            className={`mt-1 w-full rounded-md border border-border px-3 py-2 text-sm ${
              defaultGuestName ? "bg-surface-muted text-muted" : "bg-transparent"
            }`}
          />
          {defaultGuestName ? (
            <p className="mt-1 text-xs text-muted">Using the name on your account</p>
          ) : errors.guestName ? (
            <p className="mt-1 text-xs text-red-600">{errors.guestName.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="guestEmail" className="text-xs font-medium text-muted">
            Email
          </label>
          <input
            id="guestEmail"
            type="email"
            {...register("guestEmail", { required: "Enter a valid email" })}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
          {errors.guestEmail ? (
            <p className="mt-1 text-xs text-red-600">{errors.guestEmail.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="guestPhone" className="text-xs font-medium text-muted">
            Phone number
          </label>
          <input
            id="guestPhone"
            type="tel"
            {...register("guestPhone", { required: "Enter a valid phone number" })}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
          {errors.guestPhone ? (
            <p className="mt-1 text-xs text-red-600">{errors.guestPhone.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="paymentMethod" className="text-xs font-medium text-muted">
            Payment method
          </label>
          <select
            id="paymentMethod"
            {...register("paymentMethod")}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">
            No payment is processed now — you&apos;ll settle payment via your chosen method.
          </p>
        </div>
        <div>
          <label htmlFor="guestNotes" className="text-xs font-medium text-muted">
            Special requests (optional)
          </label>
          <textarea
            id="guestNotes"
            rows={2}
            {...register("guestNotes")}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
      </div>

      {serverError ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Reserving…" : "Reserve this villa"}
      </button>
    </form>
  );
}
