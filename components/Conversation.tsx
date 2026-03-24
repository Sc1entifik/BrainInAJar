import {
  ConversationActions,
  ConversationFields,
} from "../enums/conversationFields.ts";
import { SiteMap } from "../enums/siteMap.ts";
import AgentMessage from "./AgentMesssage.tsx";
import UserMessage from "./UserMessage.tsx";

export default function Conversation(
  { userMessage, agentMessage, brainName, turnId }: {
    userMessage: string;
    agentMessage: string;
    brainName?: string;
    turnId?: string;
  },
) {
  return (
    <div class="flex flex-col items-start w-full border-b border-brain-pink/25 pb-4 mb-4">
      <UserMessage userMessage={userMessage} />
      <AgentMessage agentMessage={agentMessage} />
      {brainName && turnId
        ? (
          <form
            method="POST"
            action={SiteMap.CONVERSATION}
            f-partial={SiteMap.CONVERSATION}
          >
            <input
              type="hidden"
              name={ConversationFields.ACTION}
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
              class="font-cherrybomb text-xl text-brain-pink hover:text-amber-200 cursor-pointer"
            >
              DELETE TURN
            </button>
          </form>
        )
        : null}
    </div>
  );
}
