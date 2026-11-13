export const ROLES = [
  "super_admin",
  "school_admin",
  "principal",
  "vice_principal",
  "teacher",
  "accountant",
  "student",
  "parent",
  "staff",
  "user",
] as const;

export type Role = (typeof ROLES)[number];

export const PLATFORM_ROLES = [
  "super_admin",
  "user",
] as const satisfies readonly Role[];
export const TENANT_ROLES = [
  "school_admin",
  "principal",
  "vice_principal",
  "teacher",
  "accountant",
  "student",
  "parent",
  "staff",
] as const satisfies readonly Role[];

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export const SCHOOL_STATUSES = [
  "pending_approval",
  "active",
  "suspended",
  "rejected",
] as const;
export type SchoolStatus = (typeof SCHOOL_STATUSES)[number];

export const INSTITUTION_TYPES = [
  "school",
  "college",
  "institute",
  "coaching",
] as const;
export type InstitutionType = (typeof INSTITUTION_TYPES)[number];
