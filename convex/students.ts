import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Assignment, Student, Grade } from "../types";

export const getStudents = query({
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
