export const tokens = {
  brand: "#3457D5",
  brandFg: "#FAFAFA",
  foreground: "#18181B",
  muted: "#737373",
  border: "#E5E5E5",
  background: "#FFFFFF",
  success: "#22A06B",
  warning: "#E6A100",
  danger: "#C8312A",
  info: "#2B92D6",
  radius: 6,
  fontFamily: "Inter",
} as const;

export type PdfTokens = typeof tokens;
