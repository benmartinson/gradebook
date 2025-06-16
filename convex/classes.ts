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
      classCode: args.classCode,
    });
    return classId;
  },
});

export const updateClass = mutation({
  args: {
    _id: v.id("classes"),
    field: v.string(),
    value: v.union(v.string(), v.number()),
  },
  handler: async (ctx, args): Promise<void> => {
    const { _id, field, value } = args;
    let parsedValue: string | number = value;
    await ctx.db.patch(_id, { [field]: parsedValue });
  },
});
