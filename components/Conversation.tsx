import {
  ConversationActions,
  ConversationFields,
} from "../enums/conversationFields.ts";
import { SiteMap } from "../enums/siteMap.ts";

function formatChatTime(timestamp?: string): string {
  if (!timestamp) {
    return "";
  }

  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Conversation(
  {
    userMessage,
    agentMessage,
    userCreatedAt,
    agentCreatedAt,
    brainName,
    turnId,
  }: {
    userMessage: string;
    agentMessage: string;
    userCreatedAt?: string;
    agentCreatedAt?: string;
    brainName?: string;
    turnId?: string;
  },
) {
  return (
    <div class="flex flex-col gap-3 w-full">
      <div class="flex justify-end">
        <div class="chat-bubble chat-bubble-user">
          <p class="font-quantico text-base md:text-lg text-white whitespace-pre-wrap leading-relaxed">
            {userMessage}
          </p>
          <p class="chat-bubble-time text-white/75">
            {formatChatTime(userCreatedAt)}
          </p>
        </div>
      </div>
      <div class="flex justify-start">
        <div class="chat-bubble chat-bubble-agent">
          <p class="font-quantico text-base md:text-lg text-slate-900 whitespace-pre-wrap leading-relaxed">
            {agentMessage}
          </p>
          <div class="mt-3 flex items-center justify-between gap-4">
            <p class="chat-bubble-time text-slate-500">
              {formatChatTime(agentCreatedAt)}
            </p>
            {brainName && turnId
              ? (
                <form
                  method="POST"
                  action={SiteMap.CONVERSATION}
                  f-partial={SiteMap.CONVERSATION}
                >
                  <input
                    type="hidden"
                    name={ConversationFields.INTENT}
                    value={ConversationActions.DELETE_TURN}
                  />
                  <input
                    type="hidden"
                    name={ConversationFields.BRAIN_NAME}
                    value={brainName}
                  />
                  <input
                    type="hidden"
                    name={ConversationFields.TURN_ID}
                    value={turnId}
                  />
                  <button
                    type="submit"
                    class="font-chakra text-xs tracking-[0.16em] text-brain-pink hover:text-slate-700 cursor-pointer"
                  >
                    DELETE
                  </button>
                </form>
              )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
