import { Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import ChatForm from "../components/ChatForm.tsx";


export default define.page(function Home(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto bg-bubble-gum-blue h-fit">
			<div class="flex justify-center">
				<img src="/brainCropped.svg" alt="Cartoon image of a brain in a jar" />
				<h1	class="text-8xl text-brain-pink font-bold text-left font-logo">BRAIN IN A JAR</h1>
			</div>
			<div class="mx-auto flex flex-col items-center w-[65dvw] h-fit min-h-[90dvh] bg-black py-4">
				<div class="mx-2 flex flex-col">
					<Partial name="chatResponse">{}</Partial>
					<Partial name="chatResponseForm"><ChatForm url="/conversation" /></Partial>
				</div>
			</div>
    </div>
  );
});
