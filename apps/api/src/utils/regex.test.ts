import { describe, expect, it } from "vitest";

import { escapeRegExp, prefixPattern, searchPattern } from "./regex.js";

describe("searchPattern", () => {
  it("matches regex metacharacters literally", () => {
    expect(searchPattern("S-(1)").test("S-(1)")).toBe(true);
    expect(searchPattern("a.c").test("abc")).toBe(false);
    expect(searchPattern("100%").test("score 100%")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(searchPattern("joseph").test("Joseph Mulwa")).toBe(true);
  });

  it("never throws on unbalanced input", () => {
    for (const q of ["(", "[", "\\", "*", "+?", "{2,}"]) {
      expect(() => searchPattern(q)).not.toThrow();
    }
  });

  it("escapes every metacharacter", () => {
    expect(escapeRegExp(".*+?^${}()|[]\\")).toBe(
      "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"
    );
  });
});

describe("prefixPattern", () => {
  it("matches actions that start with the text", () => {
    expect(prefixPattern("school.").test("school.approve")).toBe(true);
    expect(prefixPattern("fee.collect").test("fee.collect")).toBe(true);
    expect(prefixPattern("Student").test("student.create")).toBe(true);
    expect(prefixPattern("approve").test("school.approve")).toBe(false);
  });

  it("treats the text literally", () => {
    expect(prefixPattern("school.").test("schoolXapprove")).toBe(false);
    expect(() => prefixPattern("fee.(")).not.toThrow();
    expect(prefixPattern(".*").test("school.approve")).toBe(false);
  });
});
