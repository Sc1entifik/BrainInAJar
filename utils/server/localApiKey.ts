import { FileMap } from "../../enums/fileMap.ts";
import { hasOpenAiApiKey } from "./openAiClient.ts";

async function readEnvLines(): Promise<string[]> {
  try {
    const fileContents = await Deno.readTextFile(FileMap.ENV);
    return fileContents.split(/\r?\n/);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return [];
    }

    throw error;
  }
}

function stripOpenAiKeyLines(lines: string[]): string[] {
  return lines.filter((line) =>
    !line.startsWith("OPENAI_API_KEY=") && !line.startsWith("CHAT_GPT_KEY=")
  );
}

export function getCurrentApiKeySource():
  | "OPENAI_API_KEY"
  | "CHAT_GPT_KEY"
  | null {
  if (Deno.env.get("OPENAI_API_KEY")) {
    return "OPENAI_API_KEY";
  }

  if (Deno.env.get("CHAT_GPT_KEY")) {
    return "CHAT_GPT_KEY";
  }

  return null;
}

export function isApiKeyConfigured(): boolean {
  return hasOpenAiApiKey();
}

export async function saveLocalApiKey(apiKey: string): Promise<void> {
  const lines = stripOpenAiKeyLines(await readEnvLines())
    .filter((line) => line.trim() !== "");

  lines.push(`OPENAI_API_KEY=${apiKey}`);

  await Deno.writeTextFile(FileMap.ENV, `${lines.join("\n")}\n`);
  Deno.env.set("OPENAI_API_KEY", apiKey);
  Deno.env.delete("CHAT_GPT_KEY");
}

export async function clearLocalApiKey(): Promise<void> {
  const lines = stripOpenAiKeyLines(await readEnvLines())
    .filter((line) => line.trim() !== "");

  await Deno.writeTextFile(
    FileMap.ENV,
    lines.length > 0 ? `${lines.join("\n")}\n` : "",
  );
  Deno.env.delete("OPENAI_API_KEY");
  Deno.env.delete("CHAT_GPT_KEY");
}
