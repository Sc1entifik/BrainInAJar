import {
  ConversationActions,
  ConversationFields,
} from "../enums/conversationFields.ts";

export default function ChatForm(
  { url, brainName, initialMessage = "" }: {
    url: string;
    brainName: string;
    initialMessage?: string;
  },
) {
  return (
    <form
      class="flex items-center gap-3 my-3 w-full"
      method="POST"
      action={url}
      f-partial={url}
    >
      <input
        type="hidden"
        name={ConversationFields.ACTION}
        value={ConversationActions.SEND_MESSAGE}
      />
      <input
        type="hidden"
        name={ConversationFields.BRAIN_NAME}
        value={brainName}
      />
      <input
        name={ConversationFields.USER_MESSAGE}
        class="bg-white font-quantico text-black text-lg px-3 py-2 rounded-xl flex-1"
        placeholder="Ask your brain something..."
        defaultValue={initialMessage}
        autofocus
        required
      />
      <button
        type="submit"
        class="font-cherrybomb text-2xl text-brain-text hover:text-brain-pink cursor-pointer"
      >
        SEND
      </button>
    </form>
  );
}
