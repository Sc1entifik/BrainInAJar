import AgentMessage from "./AgentMesssage.tsx";
import UserMessage from "./UserMessage.tsx";

export default function Conversation({userMessage, agentMessage}: {userMessage: string, agentMessage:string}) {
	return (
		<div class="flex flex-col items-start">
			<UserMessage userMessage={userMessage} />
			<AgentMessage agentMessage={agentMessage} />
		</div>
	);
}
