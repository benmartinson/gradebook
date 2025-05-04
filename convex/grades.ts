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
