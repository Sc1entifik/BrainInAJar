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
    const action = form.get(ConversationFields.ACTION);

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

    if (action === ConversationActions.DELETE_TURN) {
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
        <div class="max-w-[50dvw] font-conversation text-2xl">
          {data.errorMessage
            ? <p class="text-amber-200 pb-4">{data.errorMessage}</p>
            : null}
          {data.turns.length === 0
            ? (
              <p class="text-brain-text">
                Start the conversation and your chat history will stay saved in
                `brain.json`.
              </p>
            )
            : data.turns.map((turn) => (
              <Conversation
                key={turn.turnId}
                userMessage={turn.userMessage}
                agentMessage={turn.agentMessage}
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
