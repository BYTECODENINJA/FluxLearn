import { describe, expect, it } from "vitest";
import { paymentMethodLabel } from "./format.js";

describe("paymentMethodLabel", () => {
  it("prints every stored payment method in words (receipts, payslips)", () => {
    expect(paymentMethodLabel("bank_transfer")).toBe("Bank transfer");
    expect(paymentMethodLabel("cash")).toBe("Cash");
    expect(paymentMethodLabel("online")).toBe("Online");
    expect(paymentMethodLabel("cheque")).toBe("Cheque");
    expect(paymentMethodLabel("other")).toBe("Other");
  });

  it("falls back to readable words for a value it doesn't know", () => {
    expect(paymentMethodLabel("mobile_wallet")).toBe("Mobile wallet");
    expect(paymentMethodLabel("")).toBe("—");
  });
});
