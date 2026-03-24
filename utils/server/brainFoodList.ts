import { FileMap } from "../../enums/fileMap.ts";
import { ensureBrainData } from "./brainStore.ts";

const brainFoodList = async (): Promise<string[]> => {
  await ensureBrainData();

  return (await Array.fromAsync(Deno.readDir(FileMap.BRAIN_FOOD)))
    .filter((entry) => entry.isFile)
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
};

export default brainFoodList;
