import { BrainContextFormInput } from "../islands/BrainContextFormInput.tsx";
import { BrainModelFormInput } from "./BrainModelFormInput.tsx";
import BrainNameFormInput from "./BrainNameFormInput.tsx";
import { BrainReasoningInputForm } from "./BrainReasoningFormInput.tsx";

export function CreateBrainForm(
  {
    url,
    chatModels,
    modelMessage,
  }: {
    url: string;
    chatModels: string[];
    modelMessage?: string;
  },
) {
  return (
    <form
      method="POST"
      action={url}
      class="font-cherrybomb text-brain-pink text-3xl"
    >
      <BrainNameFormInput />
      <BrainReasoningInputForm />
      <BrainContextFormInput />
      <p class="mt-10 block">CHOOSE YOUR BRAIN MODEL</p>
      {modelMessage
        ? (
          <p class="mt-3 mb-5 font-chakra text-amber-200 text-xl max-w-[44rem]">
            {modelMessage}
          </p>
        )
        : null}
      <BrainModelFormInput chatModels={chatModels} />
      <button type="submit" hidden>Submit</button>
    </form>
  );
}
