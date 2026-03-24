import { define } from "../utils.ts";
import { Reasoning, UserBrains } from "../types/brain.ts";
import { CreateBrainsFields } from "../enums/createBrainsFields.ts";
import chatModelList from "../utils/server/chatModelList.ts";
import { CreateBrainForm } from "../components/CreateBrainForm.tsx";
import createVectorStore from "../utils/server/createVectorStore.ts";
import {
  createConversationMessage,
  readUserBrains,
  writeUserBrains,
} from "../utils/server/brainStore.ts";
import { hasOpenAiApiKey } from "../utils/server/openAiClient.ts";

function redirectToCreateBrain(message?: string): Response {
  const headers = new Headers();
  const location = new URL("/createBrain", "http://braininajar.local");

  if (message) {
    location.searchParams.set("message", message);
  }

  headers.set("location", `${location.pathname}${location.search}`);
  return new Response(null, { status: 303, headers });
}

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();
    const name = form.get(CreateBrainsFields.NAME);
    const model = form.get(CreateBrainsFields.MODEL);
    const system_role = form.get(CreateBrainsFields.SYSTEM);
    const reasoning = form.get(CreateBrainsFields.REASONING);
    const userBrains: UserBrains = await readUserBrains();
    //[name, model, reasoning, system_role].forEach(x => console.log(`${x}: ${typeof x === "string"}`));

    if (
      typeof name === "string" && typeof model === "string" &&
      typeof reasoning === "string" && typeof system_role === "string"
    ) {
      const effort = reasoning as Reasoning;

      if (!Object.hasOwn(userBrains, name)) {
        try {
          userBrains[name] = {
            model,
            reasoning: { effort },
            tools: [
              {
                type: "file_search",
                vector_store_ids: hasOpenAiApiKey()
                  ? [await createVectorStore(name)]
                  : [],
              },
            ],
            input: [createConversationMessage("system", system_role)],
            files: [],
          };

          await writeUserBrains(userBrains);

          return redirectToCreateBrain(
            hasOpenAiApiKey()
              ? `Created ${name}.`
              : `Created ${name}. Add your API key later to enable vector stores and chat.`,
          );
        } catch (error) {
          return redirectToCreateBrain(
            error instanceof Error
              ? error.message
              : "Something went wrong while creating the brain.",
          );
        }
      }

      return redirectToCreateBrain(`${name} already exists.`);
    }

    return redirectToCreateBrain(
      "Please fill out every field before submitting.",
    );
  },
});

export default define.page(async (ctx) => {
  const userBrains: UserBrains = await readUserBrains();
  const brainList = Object.keys(userBrains);
  const pageMessage = ctx.url.searchParams.get("message") || "";
  let chatModels: string[] = [];
  let modelMessage = "";

  try {
    chatModels = await chatModelList();
  } catch (error) {
    modelMessage = error instanceof Error
      ? `${error.message} You can still type a model id manually and create the brain now.`
      : "Could not load model choices from OpenAI. You can still type a model id manually.";
  }

  return (
    <div class="flex flex-col items-center pt-9 gap-6">
      <h1 class="text-center text-brain-pink text-6xl font-logo">
        CREATE A NEW BRAIN!
      </h1>
      <h2 class="text-brain-pink font-cherrybomb text-4xl ">
        YOUR CURRENT BRAINS
      </h2>
      <div class="flex flex-col items-start">
        {brainList.length === 0
          ? (
            <p class="font-chakra text-brain-text font-bold text-2xl">
              You currently have no brains! Don't worry you are in the right
              place!
            </p>
          )
          : brainList.map((x, y) => (
            <p class="text-2xl text-amber-200 font-chakra" key={y}>{x}</p>
          ))}
      </div>
      {pageMessage
        ? (
          <p class="font-chakra text-amber-200 text-xl max-w-[44rem] text-center">
            {pageMessage}
          </p>
        )
        : null}
      <CreateBrainForm
        url="/createBrain"
        chatModels={chatModels}
        modelMessage={modelMessage}
      />
    </div>
  );
});
