import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    user: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("This TypeScript function is running on the server.");
    await ctx.db.insert("messages", {
      user: args.user,
      body: args.body,
    });
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    // Get most recent messages first
    const messages = await ctx.db.query("messages").order("desc").take(50);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const addAssignment = mutation({
  args: {
    description: v.string(),
    assignmentType: v.string(),
    weight: v.number(),
    maxPoints: v.number(),
    dueDate: v.string(),
    assignedDate: v.string(),
    notes: v.string(),
    isExtraCredit: v.boolean(),
  },

  handler: async (ctx, args) => {
    await ctx.db.insert("assignments", {
      description: args.description,
      assignmentType: args.assignmentType,
      weight: args.weight,
      maxPoints: args.maxPoints,
      dueDate: args.dueDate,
      assignedDate: args.assignedDate,
      notes: args.notes,
      isExtraCredit: args.isExtraCredit,
    });
  },
});
