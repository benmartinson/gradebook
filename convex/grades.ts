import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Assignment, Student, Grade } from "../types";

export const addGrade = mutation({
  args: {
    studentId: v.id("students"),
    assignmentId: v.id("assignments"),
    rawScore: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.insert("grades", {
      studentId: args.studentId,
      assignmentId: args.assignmentId,
      rawScore: args.rawScore,
    });
  },
});

export const updateGrade = mutation({
  args: {
    id: v.id("grades"),
    rawScore: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.patch(args.id, { rawScore: args.rawScore });
  },
});

export const getGrades = query({
  args: {},
  handler: async (ctx): Promise<Grade[]> => {
    const grades = await ctx.db.query("grades").collect();
    return grades;
  },
});

export const bulkUpdateGrades = mutation({
  args: {
    gradeUpdates: v.array(
      v.object({
        studentId: v.id("students"),
        assignmentId: v.id("assignments"),
        grade: v.number(),
      })
    ),
  },
  handler: async (ctx, args): Promise<void> => {
    await Promise.all(
      args.gradeUpdates.map(async (update) => {
        // Check if grade already exists
        const existingGrade = await ctx.db
          .query("grades")
          .withIndex("byStudentAndAssignment", (q) =>
            q
              .eq("studentId", update.studentId)
              .eq("assignmentId", update.assignmentId)
          )
          .first();

        if (existingGrade) {
          // Update existing grade
          await ctx.db.patch(existingGrade._id, { rawScore: update.grade });
        } else {
          // Create new grade
          await ctx.db.insert("grades", {
            studentId: update.studentId,
            assignmentId: update.assignmentId,
            rawScore: update.grade,
          });
        }
      })
    );
  },
});
