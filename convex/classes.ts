import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getClasses = query({
  args: {},
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").collect();
    return classes;
  },
});

export const getClassInfo = query({
  args: {
    id: v.id("classes"),
  },
  handler: async (ctx, args) => {
    const classInfo = await ctx.db.get(args.id);
    return classInfo;
  },
});

export const createClass = mutation({
  args: {
    name: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    teacher: v.string(),
    classCode: v.string(),
  },
  handler: async (ctx, args) => {
    const classId = await ctx.db.insert("classes", {
      name: args.name,
      startDate: args.startDate,
      endDate: args.endDate,
      teacher: args.teacher,
      classCode: args.classCode,
    });
    return classId;
  },
});

export const updateClass = mutation({
  args: {
    _id: v.id("classes"),
    classCode: v.string(),
    name: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    teacher: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      name: args.name,
      startDate: args.startDate,
      classCode: args.classCode,
      endDate: args.endDate,
      teacher: args.teacher,
    });
  },
});
