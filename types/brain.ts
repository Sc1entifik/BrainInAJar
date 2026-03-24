export type ConversationRole = "system" | "user" | "assistant";

export interface Conversation {
  id: string;
  role: ConversationRole;
  content: string;
  createdAt: string;
  turnId?: string;
  responseId?: string | null;
  phase?: "final_answer";
}

export type Reasoning =
  | "none"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh";

export interface BrainTool {
  type: "file_search";
  vector_store_ids: string[];
}

export interface BrainFile {
  name: string;
  fileId: string;
  vectorStoreFileId: string;
}

export interface Brain {
  model: string;
  reasoning: { effort: Reasoning };
  tools: BrainTool[];
  input: Conversation[];
  files?: BrainFile[];
}

export interface UserBrains {
  [brainName: string]: Brain;
}
