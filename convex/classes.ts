import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Assignment, Student, Grade } from "../types";

export const getClassInfo = query({
  args: {
    id: v.id("classes"),
  },
  handler: async (ctx, args) => {
    const classInfo = await ctx.db.get(args.id);
    return classInfo;
  },
});
