import { FileMap } from "../../enums/fileMap.ts";
import type { Brain, BrainFile } from "../../types/brain.ts";
import { createOpenAiClient } from "./openAiClient.ts";

async function removeBrainFile(
  vectorStoreId: string,
  brainFile: BrainFile,
): Promise<void> {
  const client = createOpenAiClient();

  await client.vectorStores.files.delete(brainFile.vectorStoreFileId, {
    vector_store_id: vectorStoreId,
  });
  await client.files.delete(brainFile.fileId);
}

async function addBrainFile(
  vectorStoreId: string,
  fileName: string,
): Promise<BrainFile> {
  const client = createOpenAiClient();
  const fileBytes = await Deno.readFile(`${FileMap.BRAIN_FOOD}${fileName}`);
  const uploadedFile = await client.files.create({
    file: new File([fileBytes], fileName),
    purpose: "assistants",
  });
  const vectorStoreFile = await client.vectorStores.files.createAndPoll(
    vectorStoreId,
    { file_id: uploadedFile.id },
  );

  if (vectorStoreFile.status !== "completed") {
    await client.files.delete(uploadedFile.id);
    throw new Error(
      vectorStoreFile.last_error?.message ||
        `Failed to process ${fileName} for the vector store.`,
    );
  }

  return {
    name: fileName,
    fileId: uploadedFile.id,
    vectorStoreFileId: vectorStoreFile.id,
  };
}

export async function syncBrainFiles(
  brain: Brain,
  selectedFiles: string[],
): Promise<void> {
  const vectorStoreId = brain.tools[0]?.vector_store_ids[0];

  if (!vectorStoreId) {
    throw new Error("This brain does not have a vector store yet.");
  }

  const currentFiles = new Map(
    (brain.files || []).map((file) => [file.name, file]),
  );
  const selectedFileSet = new Set(selectedFiles);

  for (const [fileName, brainFile] of currentFiles.entries()) {
    if (!selectedFileSet.has(fileName)) {
      await removeBrainFile(vectorStoreId, brainFile);
      currentFiles.delete(fileName);
    }
  }

  for (const fileName of selectedFiles) {
    if (!currentFiles.has(fileName)) {
      currentFiles.set(fileName, await addBrainFile(vectorStoreId, fileName));
    }
  }

  brain.files = selectedFiles
    .map((fileName) => currentFiles.get(fileName))
    .filter((file): file is BrainFile => file !== undefined);
}
