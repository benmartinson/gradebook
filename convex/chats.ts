import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { createHmac } from "crypto";
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

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("Missing AWS credentials in environment variables");
    }

    // Debug credentials (don't log actual values in production)
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

    const systemPrompt = `You are an AI assistant for a gradebook application. You help teachers manage grades, students, and assignments.
${context ? `Here is the current class data:\n${context}` : ""}

You can provide insights about student performance, help with grade calculations, answer questions about the class data, and help manage grades.
Be helpful, concise, and professional in your responses. When referring to specific students or assignments, use the data provided above.

You cannot help with anything else. You are only a gradebook assistant. If the user asks you to do something that is not related to the gradebook, you should say "I'm sorry, I can only help with gradebook related questions."

You can also help with bulk updates of grades. When the user asks you to update grades, you should:
1. First explain what changes you'll make in natural language
2. Then include a JSON structure with the changes somewhere in your response
3. The JSON MUST be valid and include these exact fields:

{
  "confirm": true,
  "changesRequested": [
    {
      "student": "Student Full Name",
      "assignment": "Assignment Name",
      "grade": 99
    }
  ]
}

Make sure to use the exact student names and assignment names from the provided class data.
Always explain the changes before showing the JSON structure.
`;

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
      // Claude's response is typically in result.content[0].text
      const modelResponse = result.content?.[0]?.text || "";

      let extractedData = null;
      const jsonMatch = modelResponse.match(/\{[\s\S]*"confirm"[\s\S]*\}/);

      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[0]);
          console.log("Extracted data:", extractedData);
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
