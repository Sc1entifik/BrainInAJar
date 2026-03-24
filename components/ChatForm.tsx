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
      class="flex items-end gap-3 w-full"
      method="POST"
      action={url}
      f-partial={url}
    >
      <input
        type="hidden"
        name={ConversationFields.INTENT}
        value={ConversationActions.SEND_MESSAGE}
      />
      <input
        type="hidden"
        name={ConversationFields.BRAIN_NAME}
        value={brainName}
      />
      <input
        name={ConversationFields.USER_MESSAGE}
        class="chat-composer-input"
        placeholder="Ask your brain something..."
        defaultValue={initialMessage}
        autofocus
        required
      />
      <button
        type="submit"
        class="chat-send-button"
      >
        SEND
      </button>
    </form>
  );
}
