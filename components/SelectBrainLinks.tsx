import { FileMap } from "../enums/fileMap.ts";

export default function SelectBrainLinks(
  { brainNames, url }: { brainNames: string[]; url: string },
) {
  return (
    <div class="flex flex-col font-cherrybomb text-4xl items-center">
      <h1 class="font-logo text-8xl text-brain-pink mb-6">SELECT A BRAIN</h1>
      <div class="flex flex-col items-start gap-y-3">
        {brainNames.length === 0
          ? (
            <p class="text-brain-text font-chakra text-2xl">
              Create a brain first, then come back here.
            </p>
          )
          : brainNames.map((x: string, y: number) => {
            return (
              <a
                href={`${url}?brainName=${encodeURIComponent(x)}`}
                key={y}
                class="flex gap-3"
              >
                <img
                  src={FileMap.LOGO}
                  alt="Cartoon image of a brain in a jar."
                  class="w-12"
                />
                <span class="text-brain-text">{x.toUpperCase()}</span>
              </a>
            );
          })}
      </div>
    </div>
  );
}
