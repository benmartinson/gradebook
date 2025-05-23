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

export const getAllStudents = query({
  args: {},
  handler: async (ctx): Promise<Student[]> => {
    const students = await ctx.db.query("students").collect();
    return students as Student[];
  },
});

export const addStudent = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args): Promise<Student> => {
    const studentId = await ctx.db.insert("students", {
      firstName: args.firstName,
      lastName: args.lastName,
    });
    const student = await ctx.db.get(studentId);
    return student as Student;
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

export const updateStudent = mutation({
  args: {
    id: v.id("students"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.patch(args.id, {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      address: args.address,
      city: args.city,
      state: args.state,
      zip: args.zip,
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
