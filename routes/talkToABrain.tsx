import { Partial } from "fresh/runtime";
import BrainLogo from "../components/BrainInAJarLogo.tsx";
import { define } from "../utils.ts";
import ChatForm from "../components/ChatForm.tsx";
import { SiteMap } from "../enums/siteMap.ts";
import getCookieValue from "../utils/server/getCookieValue.ts";

export default define.page(function TalkToABrain(ctx){
	const cookies = ctx.req.headers.get("cookie") || "";
	const brainName = getCookieValue("brainName", cookies);
	console.log(brainName);
	

	return (
		<div class="px-4 py-8 mx-auto h-fit">
			<BrainLogo />
			<div class="mx-auto flex flex-col items-center w-[65dvw] h-fit min-h-[90dvh] bg-black py-4">
				<div class="mx-2 flex flex-col" f-client-nav>
					<Partial name="chatResponse">{}</Partial>
					<Partial name="chatResponseForm">
						<ChatForm url={SiteMap.CONVERSATION} />
					</Partial>
				</div>
			</div>
		</div>
	);
});
