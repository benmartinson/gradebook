import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getRecords = query({
  args: {
    tableDef: v.string(),
  },
  handler: async (ctx, args) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) {
    //   return [];
    // }
    const result = await ctx.db.query(args.tableDef as any).collect();
    return result;
  },
});

export const createRecord = mutation({
  args: {
    tableDef: v.string(),
    record: v.any(),
  },

  handler: async (ctx, args) => {
    const result = await ctx.db.insert(args.tableDef as any, args.record);
    return result;
  },
});

export const updateRecord = mutation({
  args: {
    tableDef: v.string(),
    record: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.tableDef as any, args.record);
    return result;
  },
});

export const deleteRecord = mutation({
  args: {
    tableDef: v.string(),
    recordId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.delete(
      ctx.db.normalizeId(args.tableDef as any, args.recordId)!
    );
    return result;
  },
});
