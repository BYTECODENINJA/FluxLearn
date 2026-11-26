// UTC day helpers. Attendance dates are stored at 00:00 UTC.

export function startOfDayUtc(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

/** Inclusive [from, to] range in whole UTC days; defaults to the last `days` days. */
export function dayRange(
  from: Date | undefined,
  to: Date | undefined,
  days = 90
) {
  const end = startOfDayUtc(to ?? new Date());
  const start = from
    ? startOfDayUtc(from)
    : new Date(end.getTime() - (days - 1) * 86_400_000);
  return { from: start, to: end };
}

/**
 * An academic year's range cut off at today (whole UTC days). Attendance can
 * be dated ahead - approved leave writes "excused" days in advance - and
 * days that haven't happened yet must not count towards a rate. Used by the
 * report card and the student/parent dashboards so they agree with the
 * attendance tab, which never looks past today.
 */
export function yearToDateRange(start: Date, end: Date, now = new Date()) {
  const today = startOfDayUtc(now);
  return { from: startOfDayUtc(start), to: end < today ? end : today };
}

/**
 * Mongo filter for a `from`-`to` date filter where both ends are whole UTC
 * days: `to` covers that entire day (a `to` of 2026-11-07 keeps everything
 * written on the 7th), so the upper bound is the next day's midnight, exclusive.
 */
export function inclusiveDayFilter(
  from: Date | undefined,
  to: Date | undefined
): { $gte?: Date; $lt?: Date } | null {
  if (!from && !to) return null;
  return {
    ...(from ? { $gte: startOfDayUtc(from) } : {}),
    ...(to ? { $lt: new Date(startOfDayUtc(to).getTime() + 86_400_000) } : {}),
  };
}

export function monthStartUtc(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}
