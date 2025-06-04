import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export const getResponse = action({
  args: {
    message: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { message, context } = args;

    // Ensure credentials are not undefined
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("Missing AWS credentials in environment variables");
    }

    const client = new BedrockRuntimeClient({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const systemPrompt = `You are an AI assistant for a gradebook application. You help teachers manage grades, students, and assignments.
${context ? `Here is the current class data:\n${context}` : ''}

You can provide insights about student performance, help with grade calculations, answer questions about the class data, and help manage grades.
Be helpful, concise, and professional in your responses. When referring to specific students or assignments, use the data provided above.`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
    });

    try {
      const response = await client.send(command);
      const result = JSON.parse(new TextDecoder().decode(response.body));
      // Anthropic Claude's response is typically in result.content[0].text
      const modelResponse = result.content?.[0]?.text || "";
      return { success: true, response: modelResponse };
    } catch (error: any) {
      console.error("Bedrock Error:", error);
      return {
        success: false,
        error: error.message || "Failed to connect to Bedrock",
      };
    }
  },
});
