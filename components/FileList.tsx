import { FeedBrainFields } from "../enums/feedBrainFields.ts";
import { SiteMap } from "../enums/siteMap.ts";

export default function BrainFood(
  { brainName, files, selectedFiles }: {
    brainName: string;
    files: string[];
    selectedFiles: string[];
  },
) {
  const selectedFileSet = new Set(selectedFiles);

  return (
    <form method="POST" action={SiteMap.FEED_BRAIN} class="flex flex-col gap-4">
      <input
        type="hidden"
        name={FeedBrainFields.BRAIN_NAME}
        value={brainName}
      />
      <div class="flex flex-col items-start gap-3">
        {files.length === 0
          ? (
            <p class="text-brain-text font-chakra text-2xl">
              Add files to `data/brainFood/` and they will show up here.
            </p>
          )
          : files.map((fileName) => (
            <label
              class="flex items-center gap-3 text-brain-text font-chakra text-2xl"
              key={fileName}
            >
              <input
                type="checkbox"
                name={FeedBrainFields.SELECTED_FILES}
                value={fileName}
                checked={selectedFileSet.has(fileName)}
              />
              <span>{fileName}</span>
            </label>
          ))}
      </div>
      {files.length > 0
        ? (
          <button
            type="submit"
            class="font-cherrybomb text-3xl text-brain-pink hover:text-amber-200 cursor-pointer self-start"
          >
            SAVE BRAIN FOOD
          </button>
        )
        : null}
    </form>
  );
}
