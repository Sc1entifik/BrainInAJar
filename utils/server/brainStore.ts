import { FileMap } from "../../enums/fileMap.ts";
import type {
  Brain,
  BrainFile,
  Conversation,
  ConversationRole,
  UserBrains,
} from "../../types/brain.ts";

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful assistant inside Brain In A Jar.";

async function pathExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }

    throw error;
  }
}

export async function ensureBrainData(): Promise<void> {
  await Deno.mkdir(FileMap.DATA_DIR, { recursive: true });
  await Deno.mkdir(FileMap.BRAIN_FOOD, { recursive: true });

  if (!await pathExists(FileMap.BRAIN)) {
    await Deno.writeTextFile(FileMap.BRAIN, "{}");
  }
}

export function createConversationMessage(
  role: ConversationRole,
  content: string,
  options: {
    turnId?: string;
    responseId?: string | null;
    createdAt?: string;
  } = {},
): Conversation {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: options.createdAt || new Date().toISOString(),
    turnId: options.turnId,
    responseId: options.responseId ?? null,
    phase: role === "assistant" ? "final_answer" : undefined,
  };
}

function normalizeConversationInput(rawInput: unknown): Conversation[] {
  if (!Array.isArray(rawInput)) {
    return [createConversationMessage("system", DEFAULT_SYSTEM_PROMPT)];
  }

  let pendingTurnId: string | undefined;
  const normalized: Conversation[] = [];

  for (const message of rawInput) {
    if (typeof message !== "object" || message === null) {
      continue;
    }

    const rawMessage = message as Record<string, unknown>;
    const role = rawMessage.role;
    const content = rawMessage.content;

    if (
      (role !== "system" && role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    ) {
      continue;
    }

    let turnId = typeof rawMessage.turnId === "string"
      ? rawMessage.turnId
      : undefined;

    if (role === "user") {
      turnId ||= pendingTurnId || crypto.randomUUID();
      pendingTurnId = turnId;
    } else if (role === "assistant") {
      turnId ||= pendingTurnId || crypto.randomUUID();
      pendingTurnId = undefined;
    }

    normalized.push({
      id: typeof rawMessage.id === "string"
        ? rawMessage.id
        : crypto.randomUUID(),
      role,
      content,
      createdAt: typeof rawMessage.createdAt === "string"
        ? rawMessage.createdAt
        : new Date().toISOString(),
      turnId,
      responseId: typeof rawMessage.responseId === "string"
        ? rawMessage.responseId
        : null,
      phase: role === "assistant" ? "final_answer" : undefined,
    });
  }

  if (!normalized.some((message) => message.role === "system")) {
    normalized.unshift(
      createConversationMessage("system", DEFAULT_SYSTEM_PROMPT),
    );
  }

  return normalized;
}

function normalizeFiles(rawFiles: unknown): BrainFile[] {
  if (!Array.isArray(rawFiles)) {
    return [];
  }

  return rawFiles
    .filter((file) => typeof file === "object" && file !== null)
    .map((file) => {
      const rawFile = file as Record<string, unknown>;

      if (
        typeof rawFile.name !== "string" ||
        typeof rawFile.fileId !== "string" ||
        typeof rawFile.vectorStoreFileId !== "string"
      ) {
        return null;
      }

      return {
        name: rawFile.name,
        fileId: rawFile.fileId,
        vectorStoreFileId: rawFile.vectorStoreFileId,
      } satisfies BrainFile;
    })
    .filter((file): file is BrainFile => file !== null);
}

function normalizeBrain(rawBrain: unknown): Brain | null {
  if (typeof rawBrain !== "object" || rawBrain === null) {
    return null;
  }

  const brain = rawBrain as Record<string, unknown>;
  const model = typeof brain.model === "string" ? brain.model : "gpt-5.4-mini";
  const effort =
    typeof brain.reasoning === "object" && brain.reasoning !== null &&
      typeof (brain.reasoning as Record<string, unknown>).effort === "string"
      ? (brain.reasoning as Record<string, string>).effort
      : "none";

  const tools = Array.isArray(brain.tools)
    ? brain.tools
      .filter((tool) => typeof tool === "object" && tool !== null)
      .map((tool) => {
        const rawTool = tool as Record<string, unknown>;

        if (
          rawTool.type !== "file_search" ||
          !Array.isArray(rawTool.vector_store_ids)
        ) {
          return null;
        }

        return {
          type: "file_search" as const,
          vector_store_ids: rawTool.vector_store_ids.filter((
            vectorStoreId,
          ): vectorStoreId is string => typeof vectorStoreId === "string"),
        };
      })
      .filter((tool): tool is Brain["tools"][number] => tool !== null)
    : [];

  return {
    model,
    reasoning: {
      effort: effort === "minimal" || effort === "low" || effort === "medium" ||
          effort === "high" || effort === "xhigh" || effort === "none"
        ? effort
        : "none",
    },
    tools,
    input: normalizeConversationInput(brain.input),
    files: normalizeFiles(brain.files),
  };
}

function normalizeUserBrains(rawUserBrains: unknown): UserBrains {
  if (typeof rawUserBrains !== "object" || rawUserBrains === null) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawUserBrains)
      .map(([brainName, brain]) => [brainName, normalizeBrain(brain)] as const)
      .filter((entry): entry is [string, Brain] => entry[1] !== null),
  );
}

export async function readUserBrains(): Promise<UserBrains> {
  await ensureBrainData();

  const fileContents = await Deno.readTextFile(FileMap.BRAIN);
  const rawUserBrains = fileContents.trim() === ""
    ? {}
    : JSON.parse(fileContents);
  return normalizeUserBrains(rawUserBrains);
}

export async function writeUserBrains(userBrains: UserBrains): Promise<void> {
  await ensureBrainData();
  await Deno.writeTextFile(FileMap.BRAIN, JSON.stringify(userBrains, null, 2));
}

export function appendConversationTurn(
  brain: Brain,
  userMessage: string,
  assistantMessage: string,
  responseId: string | null,
): void {
  const turnId = crypto.randomUUID();

  brain.input.push(
    createConversationMessage("user", userMessage, { turnId }),
    createConversationMessage("assistant", assistantMessage, {
      turnId,
      responseId,
    }),
  );
}

export function invalidateStoredResponseIds(brain: Brain): void {
  brain.input = brain.input.map((message) =>
    message.role === "assistant" ? { ...message, responseId: null } : message
  );
}

export function getBrainInstructions(brain: Brain): string {
  return brain.input.find((message) => message.role === "system")?.content ||
    DEFAULT_SYSTEM_PROMPT;
}

export function getLatestResponseId(brain: Brain): string | null {
  for (let index = brain.input.length - 1; index >= 0; index--) {
    const message = brain.input[index];

    if (message.role === "assistant" && message.responseId) {
      return message.responseId;
    }
  }

  return null;
}

export function getConversationHistoryForModel(brain: Brain): Array<{
  role: "user" | "assistant";
  content: string;
  type: "message";
  phase?: "final_answer";
}> {
  return brain.input
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content,
      type: "message" as const,
      ...(message.role === "assistant"
        ? { phase: message.phase || "final_answer" }
        : {}),
    }));
}

export function deleteConversationTurn(brain: Brain, turnId: string): void {
  brain.input = brain.input.filter((message) => message.turnId !== turnId);
  invalidateStoredResponseIds(brain);
}

export function getConversationTurns(brain: Brain): Array<{
  turnId: string;
  userMessage: string;
  agentMessage: string;
  responseId: string | null;
  userCreatedAt: string;
  agentCreatedAt: string;
}> {
  const turns: Array<{
    turnId: string;
    userMessage: string;
    agentMessage: string;
    responseId: string | null;
    userCreatedAt: string;
    agentCreatedAt: string;
  }> = [];
  const turnMap = new Map<string, {
    turnId: string;
    userMessage: string;
    agentMessage: string;
    responseId: string | null;
    userCreatedAt: string;
    agentCreatedAt: string;
  }>();

  for (const message of brain.input) {
    if (message.role === "system" || !message.turnId) {
      continue;
    }

    const existingTurn = turnMap.get(message.turnId) || {
      turnId: message.turnId,
      userMessage: "",
      agentMessage: "",
      responseId: null,
      userCreatedAt: "",
      agentCreatedAt: "",
    };

    if (!turnMap.has(message.turnId)) {
      turnMap.set(message.turnId, existingTurn);
      turns.push(existingTurn);
    }

    if (message.role === "user") {
      existingTurn.userMessage = message.content;
      existingTurn.userCreatedAt = message.createdAt;
    }

    if (message.role === "assistant") {
      existingTurn.agentMessage = message.content;
      existingTurn.responseId = message.responseId ?? null;
      existingTurn.agentCreatedAt = message.createdAt;
    }
  }

  return turns.filter((turn) =>
    turn.userMessage !== "" || turn.agentMessage !== ""
  );
}
