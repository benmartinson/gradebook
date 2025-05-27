import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Klass, Teacher } from "../types";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTeacher = query({
  args: {},
  handler: async (ctx, args): Promise<Teacher | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const teacher = await ctx.db
      .query("teachers")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .first();
    return teacher as Teacher;
  },
});

export const getClassTeachers = query({
  args: {
    classId: v.id("classes"),
  },
  handler: async (ctx, args): Promise<Teacher[]> => {
    const classTeachers = await ctx.db
      .query("classTeachers")
      .withIndex("byClass", (q) => q.eq("classId", args.classId))
      .collect();
    const teacherIds = classTeachers.map(
      (classTeacher) => classTeacher.teacherId
    );
    const teachers = await Promise.all(
      teacherIds.map((teacherId) => ctx.db.get(teacherId))
    );
    return teachers.filter((teacher) => teacher !== null) as Teacher[];
  },
});

export const getTeacherClasses = query({
  args: {
    teacherId: v.id("teachers"),
  },
  handler: async (ctx, args): Promise<Klass[]> => {
    const classTeachers = await ctx.db
      .query("classTeachers")
      .withIndex("byTeacher", (q) => q.eq("teacherId", args.teacherId))
      .collect();

    const classes = await Promise.all(
      classTeachers.map((classTeacher) => ctx.db.get(classTeacher.classId))
    );
    return classes.filter((klass) => klass !== null) as Klass[];
  },
});
