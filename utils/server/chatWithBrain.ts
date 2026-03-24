import type { Brain } from "../../types/brain.ts";
import { createOpenAiClient } from "./openAiClient.ts";
import {
  getBrainInstructions,
  getConversationHistoryForModel,
  getLatestResponseId,
} from "./brainStore.ts";

function supportsReasoning(model: string): boolean {
  return model.startsWith("gpt-5");
}

function createUserInputMessage(userMessage: string) {
  return {
    role: "user" as const,
    content: userMessage,
    type: "message" as const,
  };
}

function buildResponseRequest(brain: Brain, userMessage: string) {
  const previousResponseId = getLatestResponseId(brain);

  return {
    model: brain.model,
    input: previousResponseId ? [createUserInputMessage(userMessage)] : [
      ...getConversationHistoryForModel(brain),
      createUserInputMessage(userMessage),
    ],
    instructions: getBrainInstructions(brain),
    previous_response_id: previousResponseId,
    store: true,
    truncation: "auto" as const,
    tools: brain.tools.filter((tool) => tool.vector_store_ids.length > 0),
    reasoning:
      supportsReasoning(brain.model) && brain.reasoning.effort !== "none"
        ? { effort: brain.reasoning.effort }
        : undefined,
  };
}

function extractAssistantMessage(response: {
  output_text?: string;
  output?: unknown[];
}): string {
  if (
    typeof response.output_text === "string" &&
    response.output_text.trim() !== ""
  ) {
    return response.output_text.trim();
  }

  if (!Array.isArray(response.output)) {
    return "";
  }

  return response.output
    .filter((item) => typeof item === "object" && item !== null)
    .filter((item) => (item as Record<string, unknown>).type === "message")
    .flatMap((item) => {
      const content = (item as Record<string, unknown>).content;
      return Array.isArray(content) ? content : [];
    })
    .filter((part) => typeof part === "object" && part !== null)
    .filter((part) => (part as Record<string, unknown>).type === "output_text")
    .map((part) => (part as Record<string, unknown>).text)
    .filter((text): text is string => typeof text === "string")
    .join("\n")
    .trim();
}

export async function chatWithBrain(
  brain: Brain,
  userMessage: string,
): Promise<{
  assistantMessage: string;
  responseId: string | null;
}> {
  const client = createOpenAiClient();
  const request = buildResponseRequest(brain, userMessage);
  let response;

  if (request.previous_response_id) {
    try {
      response = await client.responses.create(request);
    } catch {
      response = await client.responses.create({
        ...request,
        input: [
          ...getConversationHistoryForModel(brain),
          createUserInputMessage(userMessage),
        ],
        previous_response_id: null,
      });
    }
  } else {
    response = await client.responses.create(request);
  }

  const assistantMessage = extractAssistantMessage(response) ||
    "The model returned an empty response.";

  return {
    assistantMessage,
    responseId: typeof response.id === "string" ? response.id : null,
  };
}
