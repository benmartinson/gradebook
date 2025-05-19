import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  assignments: defineTable({
    assignedDate: v.string(),
    assignmentType: v.float64(),
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
    teacher: v.string(),
    classCode: v.string(),
  }),

  grades: defineTable({
    assignmentId: v.string(),
    rawScore: v.float64(),
    studentId: v.string(),
  }),

  students: defineTable({
    firstName: v.string(),
    lastName: v.string(),
  }),

  enrollments: defineTable({
    classId: v.id("classes"),
    studentId: v.id("students"),
    schoolYear: v.number(),
  })
    .index("byClass", ["classId"])
    .index("byStudent", ["studentId"]),
});
