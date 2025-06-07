import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Assignment, Student, Grade, AssignmentType } from "../types";
import { assignmentTypes } from "../src/constants";

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
    assignmentId: v.id("assignments"),
  },
  handler: async (ctx, args): Promise<Assignment> => {
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) {
      throw new Error(`Assignment with ID ${args.assignmentId} not found`);
    }
    return assignment as Assignment;
  },
});

export const updateAssignment = mutation({
  args: {
    assignmentId: v.id("assignments"),
    field: v.string(),
    value: v.union(v.string(), v.number()),
  },
  handler: async (ctx, args): Promise<void> => {
    const { assignmentId, field, value } = args;
    let parsedValue: string | number = value;
    if (field === "maxPoints" && typeof value === "string") {
      parsedValue = parseFloat(value);
    } else if (field === "weight" && typeof value === "string") {
      parsedValue = parseFloat(value as string);
    }

    if (field === "assignmentType") {
      parsedValue =
        assignmentTypes.find((type) => type.description === value)?.id || 0;
    }

    await ctx.db.patch(assignmentId, { [field]: parsedValue });
  },
});
