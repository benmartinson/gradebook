import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

  handler: async (ctx, args) => {
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
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getAssignments = query({
  args: {},
  handler: async (ctx) => {
    const assignments = await ctx.db.query("assignments").collect();
    return assignments;
  },
});

export const getClassStudents = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    return students;
  },
});

export const addClassStudent = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("students", { firstName: args.firstName, lastName: args.lastName });
  },
});

export const deleteClassStudent = mutation({
  args: {
    id: v.id("students"),
  },
  handler: async (ctx, args) => {
    console.log({args});
    await ctx.db.delete(args.id);
  },
});
