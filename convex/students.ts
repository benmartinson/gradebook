import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Student } from "../types";

export const getStudentsByClass = query({
  args: {
    classId: v.id("classes"),
  },
  handler: async (ctx, args): Promise<Student[]> => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("byClass", (q) => q.eq("classId", args.classId))
      .collect();
    const studentIds = enrollments.map((enrollment) => enrollment.studentId);
    const students = await Promise.all(
      studentIds.map((studentId) => ctx.db.get(studentId))
    );
    return students.filter((student) => student !== null) as Student[];
  },
});

export const addClassStudent = mutation({
  args: {
    classId: v.id("classes"),
    studentId: v.id("students"),
    schoolYear: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.insert("enrollments", {
      classId: args.classId,
      studentId: args.studentId,
      schoolYear: args.schoolYear,
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
