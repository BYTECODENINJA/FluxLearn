// packages/config has no test runner of its own; its parser is checked here.
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { envBoolean } from "@fluxlearn/config/server";

describe("envBoolean (SMTP_SECURE and other flags)", () => {
  const flag = envBoolean.default(false);

  it.each([
    ["true", true],
    ["TRUE", true],
    ["1", true],
    ["false", false],
    ["False", false],
    ["0", false],
    [" false ", false],
  ])("reads %j as %s", (input, expected) => {
    expect(flag.parse(input)).toBe(expected);
  });

  it("defaults to false when unset", () => {
    expect(flag.parse(undefined)).toBe(false);
  });

  it("rejects anything else instead of guessing", () => {
    expect(flag.safeParse("yes").success).toBe(false);
    expect(
      z.object({ SMTP_SECURE: flag }).safeParse({ SMTP_SECURE: "off" }).success
    ).toBe(false);
  });
});
