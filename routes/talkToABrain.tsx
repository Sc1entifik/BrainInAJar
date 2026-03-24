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
    <div class="px-3 py-6 mx-auto min-h-dvh">
      <BrainLogo />
      <div class="chat-shell">
        <div class="chat-shell-header">
          <div>
            <h2 class="font-cherrybomb text-3xl md:text-4xl text-white">
              {brainName}
            </h2>
            <p class="font-chakra text-sm md:text-base text-cyan-100/85 tracking-[0.18em] uppercase">
              Brain In A Jar Messenger
            </p>
          </div>
        </div>
        <div class="chat-stage">
          <Partial name="chatResponse">
            <div class="chat-history">
              {turns.length === 0
                ? (
                  <div class="chat-empty-state">
                    <p class="font-cherrybomb text-4xl text-slate-800">
                      Start Chatting
                    </p>
                    <p class="font-chakra text-lg md:text-xl text-slate-700">
                      Your messages stay saved in `brain.json`, and the layout
                      now behaves like a real messenger thread.
                    </p>
                  </div>
                )
                : turns.map((turn) => (
                  <Conversation
                    key={turn.turnId}
                    userMessage={turn.userMessage}
                    agentMessage={turn.agentMessage}
                    userCreatedAt={turn.userCreatedAt}
                    agentCreatedAt={turn.agentCreatedAt}
                    brainName={brainName}
                    turnId={turn.turnId}
                  />
                ))}
            </div>
          </Partial>
        </div>
        <div class="chat-composer">
          <Partial name="chatResponseForm">
            <ChatForm url={SiteMap.CONVERSATION} brainName={brainName} />
          </Partial>
        </div>
      </div>
    </div>
  );
});
