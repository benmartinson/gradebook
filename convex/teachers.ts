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

export const getAllTeachers = query({
  args: {},
  handler: async (ctx, args): Promise<Teacher[]> => {
    const teachers = await ctx.db.query("teachers").collect();
    return teachers as Teacher[];
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
    const teachers = await Promise.all(
      classTeachers.map(async (classTeacher) => {
        const teacher = await ctx.db.get(classTeacher.teacherId);
        if (teacher) {
          return { ...teacher, classTeacherId: classTeacher._id };
        }
        return null;
      })
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

export const addClassTeacher = mutation({
  args: {
    classId: v.id("classes"),
    teacherId: v.id("teachers"),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.insert("classTeachers", {
      classId: args.classId,
      teacherId: args.teacherId,
      schoolYear: 2025,
    });
  },
});

export const addTeacher = mutation({
  args: {
    teacher: v.object({
      name: v.optional(v.string()),
      email: v.string(),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<Teacher> => {
    const teacher = {
      ...args.teacher,
      firstName: args.teacher.name?.split(" ")[0] ?? "",
      lastName: args.teacher.name?.split(" ")[1] ?? "",
    };
    delete teacher.name;
    const teacherCreated = await ctx.db.insert("teachers", teacher);
    return teacherCreated as unknown as Teacher;
  },
});

export const removeClassTeacher = mutation({
  args: {
    id: v.id("classTeachers"),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.delete(args.id);
  },
});
