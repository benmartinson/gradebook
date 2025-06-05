import { v } from "convex/values";
import { action } from "./_generated/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { getSystemPrompt } from "../src/helpers";

export const getResponse = action({
  args: {
    message: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { message, context } = args;

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("Missing AWS credentials in environment variables");
    }

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials are missing");
    }

    const client = new BedrockRuntimeClient({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim(),
      },
    });

    const systemPrompt = getSystemPrompt(context || "");

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 20000,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
    });

    try {
      const response = await client.send(command);
      const result = JSON.parse(new TextDecoder().decode(response.body));
      // Claude's response is typically in result.content[0].text
      const modelResponse = result.content?.[0]?.text || "";

      let extractedData = null;
      const jsonMatch = modelResponse.match(/\{[\s\S]*"confirm"[\s\S]*\}/);

      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.log("Failed to parse extracted JSON:", e);
        }
      }

      return {
        success: true,
        response: modelResponse,
        data: extractedData,
      };
    } catch (error: any) {
      console.error("Bedrock Error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      });

      // Provide user-friendly error messages
      let userMessage = "Failed to connect to AI service. Please try again.";

      if (
        error.message?.includes("Authorization header") ||
        error.message?.includes("key=value pair")
      ) {
        userMessage =
          "AI service authentication failed. Please contact support.";
      } else if (error.Code === "AccessDeniedException") {
        userMessage = "AI service access denied. Please contact support.";
      } else if (error.$metadata?.httpStatusCode === 400) {
        userMessage = "Invalid request to AI service. Please try again.";
      }

      return {
        success: false,
        error: userMessage,
      };
    }
  },
});
