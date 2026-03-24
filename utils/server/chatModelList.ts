import { createOpenAiClient } from "./openAiClient.ts";

interface Model {
  id: string;
}

export default async function chatModelList(): Promise<string[]> {
  const client = createOpenAiClient();
  const models: Model[] = await client.models.list().then((x) => x.data);

  models.sort((a: Model, b: Model) => {
    const extractVersionNumber = (str: string) => {
      const versionRegEx = str.match(/\d+(\.\d+)?/);
      return versionRegEx ? parseFloat(versionRegEx[0]) : 0;
    };

    return extractVersionNumber(b.id) - extractVersionNumber(a.id);
  });

  return models
    .filter((x: Model) => x.id.slice(0, 3) === "gpt")
    .filter((x: Model) => !/\d{4}-\d{2}-\d{2}/.test(x.id))
    .filter((x: Model) => {
      const filtration_terms = [
        "chat",
        "codex",
        "tts",
        "turbo",
        "audio",
        "search",
        "transcribe",
        "image",
        "realtime",
      ];

      return !filtration_terms.some((search_term: string) =>
        x.id.includes(search_term)
      );
    })
    .map((x: Model) => x.id);
}
