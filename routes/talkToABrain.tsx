import { Partial } from "fresh/runtime";
import BrainLogo from "../components/BrainInAJarLogo.tsx";
import { define } from "../utils.ts";
import ChatForm from "../components/ChatForm.tsx";
import Conversation from "../components/Conversation.tsx";
import SelectBrainLinks from "../components/SelectBrainLinks.tsx";
import { SiteMap } from "../enums/siteMap.ts";
import {
  getConversationTurns,
  readUserBrains,
} from "../utils/server/brainStore.ts";

export default define.page(async function TalkToABrain(ctx) {
  const userBrains = await readUserBrains();
  const brainName = ctx.url.searchParams.get("brainName") || "";

  if (!userBrains[brainName]) {
    return (
      <div class="px-4 py-8 mx-auto h-fit min-h-dvh">
        <BrainLogo />
        <div class="mt-12 flex justify-center">
          <SelectBrainLinks
            brainNames={Object.keys(userBrains)}
            url={SiteMap.TALK_TO_A_BRAIN}
          />
        </div>
      </div>
    );
  }

  const turns = getConversationTurns(userBrains[brainName]);

  return (
    <div class="px-4 py-8 mx-auto h-fit">
      <BrainLogo />
      <div class="mx-auto flex flex-col items-center w-[65dvw] h-fit min-h-[90dvh] bg-black py-4">
        <div class="mx-2 flex flex-col" f-client-nav>
          <h2 class="font-cherrybomb text-4xl text-brain-pink mb-4 self-center">
            {brainName.toUpperCase()}
          </h2>
          <Partial name="chatResponse">
            <div class="max-w-[50dvw] font-conversation text-2xl">
              {turns.length === 0
                ? (
                  <p class="text-brain-text">
                    Start the conversation and your chat history will stay saved
                    in `brain.json`.
                  </p>
                )
                : turns.map((turn) => (
                  <Conversation
                    key={turn.turnId}
                    userMessage={turn.userMessage}
                    agentMessage={turn.agentMessage}
                    brainName={brainName}
                    turnId={turn.turnId}
                  />
                ))}
            </div>
          </Partial>
          <Partial name="chatResponseForm">
            <ChatForm url={SiteMap.CONVERSATION} brainName={brainName} />
          </Partial>
        </div>
      </div>
    </div>
  );
});
