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

export const getClassStudents = query({
  args: {},
  handler: async (ctx): Promise<Student[]> => {
    const students = await ctx.db.query("students").collect();
    return students;
  },
});

export const addClassStudent = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.insert("students", {
      firstName: args.firstName,
      lastName: args.lastName,
    });
  },
});

export const deleteClassStudent = mutation({
  args: {
    id: v.id("students"),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.delete(args.id);
  },
});

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
