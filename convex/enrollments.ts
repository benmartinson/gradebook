import { ClassStudent, Enrollment, Student } from "../types";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getEnrollments = query({
  args: {},
  handler: async (ctx, args): Promise<ClassStudent[]> => {
    const enrollments = await ctx.db.query("enrollments").collect();
    const studentIds = enrollments.map((enrollment) => enrollment.studentId);
    const students = await Promise.all(
      studentIds.map((studentId) => ctx.db.get(studentId))
    );
    const classStudents = enrollments.map((enrollment) => {
      const student = students.find(
        (student) => student?._id === enrollment.studentId
      );
      return {
        enrollmentId: enrollment?._id,
        studentId: student?._id,
        classId: enrollment?.classId,
        schoolYear: enrollment?.schoolYear,
        firstName: student?.firstName,
        lastName: student?.lastName,
      };
    });

    return classStudents.filter(
      (student) =>
        student.enrollmentId !== undefined && student.studentId !== undefined
    ) as ClassStudent[];
  },
});

export const addEnrollment = mutation({
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

export const removeEnrollment = mutation({
  args: {
    enrollmentId: v.id("enrollments"),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.delete(args.enrollmentId);
  },
});
