import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  assignments: defineTable({
    assignedDate: v.string(),
    assignmentType: v.number(),
    description: v.string(),
    dueDate: v.string(),
    classId: v.id("classes"),
    maxPoints: v.float64(),
    notes: v.string(),
    weight: v.float64(),
    isExtraCredit: v.optional(v.boolean()),
  }).index("byClass", ["classId"]),

  classes: defineTable({
    endDate: v.string(),
    name: v.string(),
    startDate: v.string(),
    classCode: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  }),

  grades: defineTable({
    assignmentId: v.string(),
    rawScore: v.float64(),
    studentId: v.string(),
  }).index("byStudentAndAssignment", ["studentId", "assignmentId"]),

  students: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
  }),

  teachers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    userId: v.optional(v.id("users")), // option because may not have account yet
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  }).index("byUser", ["userId"]),

  classTeachers: defineTable({
    teacherId: v.id("teachers"),
    classId: v.id("classes"),
    schoolYear: v.number(),
  })
    .index("byClass", ["classId"])
    .index("byTeacher", ["teacherId"]),

  enrollments: defineTable({
    classId: v.id("classes"),
    studentId: v.id("students"),
    schoolYear: v.number(),
  })
    .index("byClass", ["classId"])
    .index("byStudent", ["studentId"]),

  // User-specific component overrides for AI customization
  userComponentOverrides: defineTable({
    userId: v.id("users"),
    componentKey: v.string(), // e.g., "Grid/StudentInfo"
    bundleUrl: v.string(), // Full URL to the bundled component on Adaptations
    sourceCode: v.string(), // The modified source code (for future AI edits)
  })
    .index("byUser", ["userId"])
    .index("byUserAndComponent", ["userId", "componentKey"]),
});
