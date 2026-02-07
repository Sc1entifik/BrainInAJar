import { Head, Partial } from "fresh/runtime";
import { define } from "../utils.ts";
import ChatForm from "../components/ChatForm.tsx";


export default define.page(function Home(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto bg-bubble-gum-blue h-fit">
      <Head>
        <title>Brain In A Jar</title>
      </Head>
			<h1 class="text-4xl text-brain-pink font-bold text-center">Brain In A Jar</h1>
			<div class="mx-auto flex flex-col items-center w-[65dvw] h-fit min-h-[90dvh] bg-black py-4">
				<div class="mx-2 flex flex-col">
					<Partial name="chatResponse">{}</Partial>
					<Partial name="chatResponseForm"><ChatForm url="/conversation" /></Partial>
				</div>
			</div>
    </div>
  );
});
