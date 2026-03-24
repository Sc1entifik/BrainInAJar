import { createOpenAiClient } from "./openAiClient.ts";

export default async function createVectorStore(
  brainName: string,
): Promise<string> {
  const client = createOpenAiClient();
  const vectorStore = await client
    .vectorStores
    .create({
      name: brainName,
    });

  return vectorStore.id;
}
