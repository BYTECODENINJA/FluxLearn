// Search boxes send free text. It must match literally - never be compiled as a
// user-supplied pattern (an unbalanced "(" would 500, and a crafted pattern
// could backtrack for seconds).
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export function searchPattern(q: string): RegExp {
  return new RegExp(escapeRegExp(q), "iu");
}

/**
 * Audit-log action filter: matches actions that start with the text, so
 * "school." finds school.signup, school.approve, ... and a full name still
 * finds just that action. Anchored and case-sensitive so the action index
 * can serve it; action names are lower-case, so the input is lower-cased.
 */
export function prefixPattern(text: string): RegExp {
  return new RegExp(`^${escapeRegExp(text.trim().toLowerCase())}`, "u");
}
