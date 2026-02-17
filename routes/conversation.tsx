import { Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import Conversation from "../components/Conversation.tsx";
import ChatForm from "../components/ChatForm.tsx";
import { SiteMap } from "../enums/siteMap.ts";

export default define.page((ctx) => {
	const userMessage = ctx.url.searchParams.get("userMessage") as string;
	const agentMessage = "Let's watch this partial go through!";
	const formKey = crypto.randomUUID();

	return (
		<div>
			<Partial name="chatResponse" mode="append">
				<div class="max-w-[50dvw] font-conversation text-2xl">
					<Conversation userMessage={userMessage} agentMessage={agentMessage}/>
				</div>
			</Partial>
			<Partial name="chatResponseForm"><ChatForm url={SiteMap.CONVERSATION} key={formKey}/></Partial>
		</div>
	)
})
