import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createClass = mutation({
  args: {
    tableDef: v.string(),
    record: v.any(),
  },

  handler: async (ctx, args) => {
    const result = await ctx.db.insert(args.tableDef as any, args.record);
    return result;
  },
});
