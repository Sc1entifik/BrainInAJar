import { page } from "fresh";
import BrainLogo from "../components/BrainInAJarLogo.tsx";
import { ApiKeyActions, ApiKeyFields } from "../enums/apiKeyFields.ts";
import { FileMap } from "../enums/fileMap.ts";
import { SiteMap } from "../enums/siteMap.ts";
import { define } from "../utils.ts";
import {
  clearLocalApiKey,
  getCurrentApiKeySource,
  isApiKeyConfigured,
  saveLocalApiKey,
} from "../utils/server/localApiKey.ts";

interface ApiKeyPageData {
  isConfigured: boolean;
  currentSource: "OPENAI_API_KEY" | "CHAT_GPT_KEY" | null;
  message?: string;
}

function redirectToApiKey(message: string): Response {
  const headers = new Headers();
  const location = new URL(SiteMap.API_KEY, "http://braininajar.local");
  location.searchParams.set("message", message);
  headers.set("location", `${location.pathname}${location.search}`);
  return new Response(null, { status: 303, headers });
}

function currentApiKeyPageData(message = ""): ApiKeyPageData {
  return {
    isConfigured: isApiKeyConfigured(),
    currentSource: getCurrentApiKeySource(),
    message,
  };
}

export const handler = define.handlers<ApiKeyPageData>({
  GET(ctx) {
    return page(
      currentApiKeyPageData(ctx.url.searchParams.get("message") || ""),
    );
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const intent = form.get(ApiKeyFields.INTENT);

    if (intent === ApiKeyActions.CLEAR) {
      await clearLocalApiKey();
      return redirectToApiKey(
        "OpenAI API key removed from the local .env file.",
      );
    }

    const apiKey = form.get(ApiKeyFields.API_KEY);
    if (typeof apiKey !== "string" || apiKey.trim() === "") {
      return page(
        currentApiKeyPageData("Enter an OpenAI API key before saving."),
      );
    }

    await saveLocalApiKey(apiKey.trim());
    return redirectToApiKey(
      "OpenAI API key saved locally. You can use chat features now.",
    );
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <div class="px-4 py-8 mx-auto min-h-dvh flex flex-col items-center">
      <BrainLogo />
      <div class="w-full max-w-3xl mt-10 bg-black/90 px-8 py-10 rounded-3xl">
        <h1 class="font-logo text-6xl text-brain-pink text-center">
          SET OPENAI KEY
        </h1>
        <p class="mt-6 font-chakra text-brain-text text-2xl">
          This saves your API key to the local `.env` file on this machine only.
        </p>
        <p class="mt-4 font-chakra text-amber-200 text-xl">
          Current status: {data.isConfigured
            ? `configured through ${data.currentSource}.`
            : "not configured yet."}
        </p>
        <p class="mt-2 font-chakra text-amber-200 text-xl">
          Local env file: {FileMap.ENV}
        </p>
        {data.message
          ? (
            <p class="mt-4 font-chakra text-amber-200 text-xl">
              {data.message}
            </p>
          )
          : null}

        <form
          method="POST"
          action={SiteMap.API_KEY}
          class="mt-8 flex flex-col gap-5"
        >
          <input
            type="hidden"
            name={ApiKeyFields.INTENT}
            value={ApiKeyActions.SAVE}
          />
          <label
            for={ApiKeyFields.API_KEY}
            class="font-cherrybomb text-brain-pink text-3xl"
          >
            OPENAI API KEY
          </label>
          <input
            type="password"
            name={ApiKeyFields.API_KEY}
            id={ApiKeyFields.API_KEY}
            class="bg-white font-quantico text-black text-base px-3 py-3 rounded-xl"
            placeholder="Paste your API key here"
            autocomplete="off"
            required
          />
          <button
            type="submit"
            class="self-start font-cherrybomb text-3xl text-brain-pink hover:text-amber-200 cursor-pointer"
          >
            SAVE KEY
          </button>
        </form>

        <form method="POST" action={SiteMap.API_KEY} class="mt-6">
          <input
            type="hidden"
            name={ApiKeyFields.INTENT}
            value={ApiKeyActions.CLEAR}
          />
          <button
            type="submit"
            class="font-cherrybomb text-2xl text-brain-text hover:text-amber-200 cursor-pointer"
          >
            CLEAR SAVED KEY
          </button>
        </form>
      </div>
    </div>
  );
});
