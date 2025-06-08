import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
    isAI: v.boolean(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      text: args.text,
      userId: args.userId,
      userName: args.userName,
      createdAt: Date.now(),
      isAI: args.isAI,
    });
    return messageId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(100);
    return messages;
  },
});
