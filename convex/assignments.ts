import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Assignment, Student, Grade } from "../types";

export const addAssignment = mutation({
  args: {
    description: v.string(),
    assignmentType: v.string(),
    weight: v.number(),
    maxPoints: v.number(),
    dueDate: v.string(),
    assignedDate: v.string(),
    notes: v.optional(v.string()),
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
  args: {},
  handler: async (ctx): Promise<Assignment[]> => {
    const assignments = await ctx.db.query("assignments").collect();
    return assignments;
  },
});

export const getAssignment = query({
  args: {
    id: v.id("assignments"),
  },
  handler: async (ctx, args): Promise<Assignment> => {
    const assignment = await ctx.db.get(args.id);
    return assignment;
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
