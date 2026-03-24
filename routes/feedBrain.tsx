import { page } from "fresh";
import FileList from "../components/FileList.tsx";
import SelectBrainLinks from "../components/SelectBrainLinks.tsx";
import { FeedBrainFields } from "../enums/feedBrainFields.ts";
import { SiteMap } from "../enums/siteMap.ts";
import { define } from "../utils.ts";
import { readUserBrains, writeUserBrains } from "../utils/server/brainStore.ts";
import brainFoodList from "../utils/server/brainFoodList.ts";
import createVectorStore from "../utils/server/createVectorStore.ts";
import { syncBrainFiles } from "../utils/server/syncBrainFiles.ts";

interface FeedBrainData {
  brainName: string;
  brainNames: string[];
  files: string[];
  selectedFiles: string[];
  statusMessage?: string;
  errorMessage?: string;
}

async function currentFeedBrainData(
  brainName: string,
  options: {
    statusMessage?: string;
    errorMessage?: string;
  } = {},
): Promise<FeedBrainData> {
  const [userBrains, files] = await Promise.all([
    readUserBrains(),
    brainFoodList(),
  ]);
  const brain = userBrains[brainName];

  return {
    brainName,
    brainNames: Object.keys(userBrains),
    files,
    selectedFiles: brain?.files?.map((file) => file.name) || [],
    statusMessage: options.statusMessage,
    errorMessage: options.errorMessage,
  };
}

export const handler = define.handlers<FeedBrainData>({
  async GET(ctx) {
    const brainName = ctx.url.searchParams.get(FeedBrainFields.BRAIN_NAME) ||
      "";
    return page(await currentFeedBrainData(brainName));
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const brainName = form.get(FeedBrainFields.BRAIN_NAME);

    if (typeof brainName !== "string" || brainName === "") {
      return page(
        await currentFeedBrainData("", {
          errorMessage: "Choose a brain before selecting files.",
        }),
      );
    }

    const [userBrains, availableFiles] = await Promise.all([
      readUserBrains(),
      brainFoodList(),
    ]);
    const brain = userBrains[brainName];

    if (!brain) {
      return page(
        await currentFeedBrainData(brainName, {
          errorMessage: "That brain could not be found.",
        }),
      );
    }

    const allowedFiles = new Set(availableFiles);
    const selectedFiles = form.getAll(FeedBrainFields.SELECTED_FILES)
      .filter((entry): entry is string => typeof entry === "string")
      .filter((fileName) => allowedFiles.has(fileName));

    try {
      if (!brain.tools[0]?.vector_store_ids[0]) {
        brain.tools = [{
          type: "file_search",
          vector_store_ids: [await createVectorStore(brainName)],
        }];
      }

      await syncBrainFiles(brain, selectedFiles);
      await writeUserBrains(userBrains);

      return page(
        await currentFeedBrainData(brainName, {
          statusMessage: selectedFiles.length === 0
            ? "All files were removed from this brain."
            : "This brain's vector store has been updated.",
        }),
      );
    } catch (error) {
      return page(
        await currentFeedBrainData(brainName, {
          errorMessage: error instanceof Error
            ? error.message
            : "Something went wrong while updating the vector store.",
        }),
      );
    }
  },
});

export default define.page<typeof handler>(function feedBrain({ data }) {
  if (!data.brainName || !data.brainNames.includes(data.brainName)) {
    return (
      <SelectBrainLinks brainNames={data.brainNames} url={SiteMap.FEED_BRAIN} />
    );
  }

  return (
    <div class="flex flex-col items-center justify-center min-h-dvh px-6 py-10">
      <div class="flex flex-col items-start gap-6 max-w-[60rem]">
        <h1 class="text-center text-brain-pink text-6xl font-logo">
          FEED {data.brainName.toUpperCase()}
        </h1>
        <p class="text-brain-text font-chakra text-2xl">
          Choose which local files in `data/brainFood/` should be available to
          this brain through file search.
        </p>
        {data.statusMessage
          ? (
            <p class="text-amber-200 font-chakra text-xl">
              {data.statusMessage}
            </p>
          )
          : null}
        {data.errorMessage
          ? (
            <p class="text-amber-200 font-chakra text-xl">
              {data.errorMessage}
            </p>
          )
          : null}
        <FileList
          brainName={data.brainName}
          files={data.files}
          selectedFiles={data.selectedFiles}
        />
      </div>
    </div>
  );
});
