import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all component overrides for the current user
export const getMyOverrides = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("userComponentOverrides")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Get a specific component override for the current user
export const getOverride = query({
  args: { componentKey: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("userComponentOverrides")
      .withIndex("byUserAndComponent", (q) =>
        q.eq("userId", userId).eq("componentKey", args.componentKey)
      )
      .first();
  },
});

// Create or update a component override
export const saveOverride = mutation({
  args: {
    componentKey: v.string(),
    bundleUrl: v.string(),
    sourceCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if override already exists
    const existing = await ctx.db
      .query("userComponentOverrides")
      .withIndex("byUserAndComponent", (q) =>
        q.eq("userId", userId).eq("componentKey", args.componentKey)
      )
      .first();

    if (existing) {
      // Update existing override
      await ctx.db.patch(existing._id, {
        bundleUrl: args.bundleUrl,
        sourceCode: args.sourceCode,
      });
      return existing._id;
    } else {
      // Create new override
      return await ctx.db.insert("userComponentOverrides", {
        userId: userId,
        componentKey: args.componentKey,
        bundleUrl: args.bundleUrl,
        sourceCode: args.sourceCode,
      });
    }
  },
});

// Delete a component override (reset to default)
export const deleteOverride = mutation({
  args: { componentKey: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userComponentOverrides")
      .withIndex("byUserAndComponent", (q) =>
        q.eq("userId", userId).eq("componentKey", args.componentKey)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
