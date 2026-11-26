import { describe, expect, it } from "vitest";
import { yearToDateRange } from "./dates.js";

describe("yearToDateRange", () => {
  const start = new Date("2026-08-01T00:00:00Z");
  const end = new Date("2027-06-30T00:00:00Z");

  it("stops at today while the year is running, so future leave days don't count", () => {
    const range = yearToDateRange(start, end, new Date("2026-11-07T16:45:00Z"));
    expect(range.from.toISOString()).toBe("2026-08-01T00:00:00.000Z");
    expect(range.to.toISOString()).toBe("2026-11-07T00:00:00.000Z");
  });

  it("keeps the year's own end once it is over", () => {
    const range = yearToDateRange(start, end, new Date("2027-09-01T08:00:00Z"));
    expect(range.to.toISOString()).toBe("2027-06-30T00:00:00.000Z");
  });
});
