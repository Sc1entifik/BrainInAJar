import { page } from "fresh";
import { Partial } from "fresh/runtime";
import ChatForm from "../components/ChatForm.tsx";
import Conversation from "../components/Conversation.tsx";
import {
  ConversationActions,
  ConversationFields,
} from "../enums/conversationFields.ts";
import { SiteMap } from "../enums/siteMap.ts";
import { define } from "../utils.ts";
import {
  appendConversationTurn,
  deleteConversationTurn,
  getConversationTurns,
  readUserBrains,
  writeUserBrains,
} from "../utils/server/brainStore.ts";
import { chatWithBrain } from "../utils/server/chatWithBrain.ts";

interface ConversationRouteData {
  brainName: string;
  draftMessage?: string;
  errorMessage?: string;
  formKey: string;
  turns: Array<{
    turnId: string;
    userMessage: string;
    agentMessage: string;
    responseId: string | null;
    userCreatedAt: string;
    agentCreatedAt: string;
  }>;
}

async function currentConversationData(
  brainName: string,
  options: {
    draftMessage?: string;
    errorMessage?: string;
  } = {},
): Promise<ConversationRouteData> {
  const userBrains = await readUserBrains();
  const brain = userBrains[brainName];

  return {
    brainName,
    draftMessage: options.draftMessage,
    errorMessage: options.errorMessage,
    formKey: crypto.randomUUID(),
    turns: brain ? getConversationTurns(brain) : [],
  };
}

export const handler = define.handlers<ConversationRouteData>({
  async GET(ctx) {
    const brainName = ctx.url.searchParams.get(ConversationFields.BRAIN_NAME) ||
      "";
    return page(await currentConversationData(brainName));
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const brainName = form.get(ConversationFields.BRAIN_NAME);
    const intent = form.get(ConversationFields.INTENT);

    if (typeof brainName !== "string" || brainName === "") {
      return page(
        await currentConversationData("", {
          errorMessage: "Choose a brain before starting a conversation.",
        }),
      );
    }

    const userBrains = await readUserBrains();
    const brain = userBrains[brainName];

    if (!brain) {
      return page(
        await currentConversationData(brainName, {
          errorMessage: "That brain could not be found.",
        }),
      );
    }

    if (intent === ConversationActions.DELETE_TURN) {
      const turnId = form.get(ConversationFields.TURN_ID);

      if (typeof turnId === "string" && turnId !== "") {
        deleteConversationTurn(brain, turnId);
        await writeUserBrains(userBrains);
      }

      return page(await currentConversationData(brainName));
    }

    const userMessage = form.get(ConversationFields.USER_MESSAGE);
    if (typeof userMessage !== "string" || userMessage.trim() === "") {
      return page(
        await currentConversationData(brainName, {
          errorMessage: "Write a message before sending it to your brain.",
        }),
      );
    }

    try {
      const { assistantMessage, responseId } = await chatWithBrain(
        brain,
        userMessage.trim(),
      );

      appendConversationTurn(
        brain,
        userMessage.trim(),
        assistantMessage,
        responseId,
      );
      await writeUserBrains(userBrains);
      return page(await currentConversationData(brainName));
    } catch (error) {
      return page(
        await currentConversationData(brainName, {
          draftMessage: userMessage,
          errorMessage: error instanceof Error
            ? error.message
            : "Something went wrong while talking to OpenAI.",
        }),
      );
    }
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <div>
      <Partial name="chatResponse">
        <div class="chat-history">
          {data.errorMessage
            ? <p class="chat-system-message">{data.errorMessage}</p>
            : null}
          {data.turns.length === 0
            ? (
              <div class="chat-empty-state">
                <p class="font-cherrybomb text-4xl text-slate-800">
                  Start Chatting
                </p>
                <p class="font-chakra text-lg md:text-xl text-slate-700">
                  Your messages stay saved in `brain.json`, and the layout now
                  behaves like a real messenger thread.
                </p>
              </div>
            )
            : data.turns.map((turn) => (
              <Conversation
                key={turn.turnId}
                userMessage={turn.userMessage}
                agentMessage={turn.agentMessage}
                userCreatedAt={turn.userCreatedAt}
                agentCreatedAt={turn.agentCreatedAt}
                brainName={data.brainName}
                turnId={turn.turnId}
              />
            ))}
        </div>
      </Partial>
      <Partial name="chatResponseForm">
        <ChatForm
          url={SiteMap.CONVERSATION}
          brainName={data.brainName}
          initialMessage={data.draftMessage}
          key={data.formKey}
        />
      </Partial>
    </div>
  );
});
