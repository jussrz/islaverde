import { describe, expect, it } from "vitest";
import { nights, rangesOverlap } from "./availability";

const d = (s: string) => new Date(`${s}T00:00:00.000Z`);

describe("rangesOverlap", () => {
  it("detects an exact overlap", () => {
    const a = { checkIn: d("2026-08-01"), checkOut: d("2026-08-05") };
    const b = { checkIn: d("2026-08-01"), checkOut: d("2026-08-05") };
    expect(rangesOverlap(a, b)).toBe(true);
  });

  it("detects a partial overlap (new booking starts mid-existing)", () => {
    const existing = { checkIn: d("2026-08-01"), checkOut: d("2026-08-05") };
    const incoming = { checkIn: d("2026-08-03"), checkOut: d("2026-08-08") };
    expect(rangesOverlap(existing, incoming)).toBe(true);
  });

  it("detects one range fully contained in another", () => {
    const existing = { checkIn: d("2026-08-01"), checkOut: d("2026-08-10") };
    const incoming = { checkIn: d("2026-08-03"), checkOut: d("2026-08-05") };
    expect(rangesOverlap(existing, incoming)).toBe(true);
  });

  it("allows a checkout that lands exactly on the next check-in (half-open ranges)", () => {
    const existing = { checkIn: d("2026-08-01"), checkOut: d("2026-08-05") };
    const incoming = { checkIn: d("2026-08-05"), checkOut: d("2026-08-08") };
    expect(rangesOverlap(existing, incoming)).toBe(false);
  });

  it("allows a check-in that lands exactly on the existing checkout, from the other side", () => {
    const existing = { checkIn: d("2026-08-05"), checkOut: d("2026-08-10") };
    const incoming = { checkIn: d("2026-08-01"), checkOut: d("2026-08-05") };
    expect(rangesOverlap(existing, incoming)).toBe(false);
  });

  it("returns false for completely disjoint ranges", () => {
    const existing = { checkIn: d("2026-08-01"), checkOut: d("2026-08-05") };
    const incoming = { checkIn: d("2026-09-01"), checkOut: d("2026-09-05") };
    expect(rangesOverlap(existing, incoming)).toBe(false);
  });
});

describe("nights", () => {
  it("computes whole nights between check-in and checkout", () => {
    expect(nights({ checkIn: d("2026-08-01"), checkOut: d("2026-08-05") })).toBe(4);
  });

  it("returns 0 for a same-day range", () => {
    expect(nights({ checkIn: d("2026-08-01"), checkOut: d("2026-08-01") })).toBe(0);
  });
});
