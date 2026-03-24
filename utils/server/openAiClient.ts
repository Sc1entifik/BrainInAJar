import OpenAI from "jsr:@openai/openai@^6.32.0";

export function hasOpenAiApiKey(): boolean {
  return Boolean(
    Deno.env.get("CHAT_GPT_KEY") || Deno.env.get("OPENAI_API_KEY"),
  );
}

export function getOpenAiApiKey(): string {
  const apiKey = Deno.env.get("CHAT_GPT_KEY") || Deno.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    throw new Error(
      "Missing OpenAI API key. Set CHAT_GPT_KEY or OPENAI_API_KEY in your local .env file.",
    );
  }

  return apiKey;
}

export function createOpenAiClient(): OpenAI {
  return new OpenAI({ apiKey: getOpenAiApiKey() });
}
