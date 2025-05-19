import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Assignment, Student, Grade } from "../types";

export const addAssignment = mutation({
  args: {
    description: v.string(),
    assignmentType: v.number(),
    weight: v.number(),
    maxPoints: v.number(),
    dueDate: v.string(),
    assignedDate: v.string(),
    notes: v.optional(v.string()),
    classId: v.id("classes"),
    isExtraCredit: v.boolean(),
  },

  handler: async (ctx, args): Promise<void> => {
    await ctx.db.insert("assignments", {
      description: args.description,
      assignmentType: args.assignmentType,
      weight: args.weight,
      maxPoints: args.maxPoints,
      dueDate: args.dueDate,
      assignedDate: args.assignedDate,
      notes: args.notes || "",
      classId: args.classId,
      isExtraCredit: args.isExtraCredit,
    });
  },
});

export const deleteAssignment = mutation({
  args: {
    id: v.id("assignments"),
    classId: v.id("classes"),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.delete(args.id);
  },
});

export const getAssignments = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args): Promise<Assignment[]> => {
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("byClass", (q) => q.eq("classId", args.classId))
      .collect();
    return assignments as Assignment[];
  },
});

export const getAssignment = query({
  args: {
    id: v.id("assignments"),
  },
  handler: async (ctx, args): Promise<Assignment> => {
    const assignment = await ctx.db.get(args.id);
    if (!assignment) {
      throw new Error(`Assignment with ID ${args.id} not found`);
    }
    return assignment as Assignment;
  },
});

export const updateAssignment = mutation({
  args: {
    field: v.string(),
    value: v.any(),
    id: v.id("assignments"),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.patch(args.id, { [args.field]: args.value });
  },
});
