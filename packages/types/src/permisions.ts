// A list of permision keys recognised by fluxlearn

export const permissions = [
  // Platform - super admin only
  "school:approve",
  "school:reject",
  "school:suspend",
  "school:read_all",
  "school:create_direct",
  "audit_log:read:all",
  "admin_transfer:force",
  "user:read_all",
  "user:invite_platform",
  "user:suspend",
  "user:assign_role",
  "system_setting:read",
  "system_setting:write",

  // Tenant - Schools and Academics
  "school:read:tenant",
  "school:update:tenant",
  "academic_year:create",
  "academic_year:update",
  "academic_year:delete",
  "academic_year:read",
  "class:create",
  "class:update",
  "class:delete",
  "class:read",
  "class:assign_teacher",
  "section:create",
  "section:update",
  "section:delete",
  "section:read",
  "subject:create",
  "subject:update",
  "subject:delete",
  "subject:read",

  // Tenant - People
  "student:create",
  "student:read",
  "student:update",
  "student:delete",
  "teacher:create",
  "teacher:read",
  "teacher:update",
  "teacher:delete",
  "parent:create",
  "parent:read",
  "parent:update",
  "parent:delete",
  "staff:create",
  "staff:read",
  "staff:update",
  "staff:delete",

  // Tenant - Attendance and academics
  "attendance:mark",
  "attendance:read:own_classes",
  "attendance:read:all",
  "staff_attendance:mark",
  "staff_attendance:read:own",
  "staff_attendance:read:all",
  "grade:enter",
  "grade:read:own_classes",
  "grade:read:all",
  "remark:create",
  "remark:read:own_classes",
  "remark:read:all",
  "exam:create",
  "exam:update",
  "exam:delete",
  "exam:read:own_classes",
  "exam:read:all",
  "exam:read",

  //Tenant - Finance
  "fee_structure:create",
  "fee_structure:read",
  "fee_structure:update",
  "fee:collect",
  "fee:read:own",
  "fee:read:tenant",
  "fee:waive",
  "salary_structure:create",
  "salary_structure:read",
  "salary_structure:update",
  "salary:collect",
  "salary:read:own",
  "salary:read:all",
  "salary:pay",

  //Tenant - Timetable, leave, admisions
  "timetable:read",
  "timetable:manege",
  "leave:request",
  "leave:approve",
  "leave:read:all",
  "admission:read",
  "admission:manage",

  // Tenant ~ library, transport, hostel
  "library:read",
  "Library:manage",
  "transport:read",
  "transport:manage",
  "hostel:read",
  "hostel:manage",
  // Tenant - meta
  // Grant / revoke the staff roles (principal, vice principal, accountant)
  // one school. Never school_admin (that is the admin transfer
  "user:assign_role:tenant",
  "audit_log:read:tenant",
  "report:export",
  "notification:read:own",
  "notification:send:tenant",
] as const;

export type Permision = (typeof permissions)[number];
export function isPernission(value: string): value is Permision {
  return (permissions as readonly string[]).includes(value);
}
