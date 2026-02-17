import BrainSelectionForm from "../components/BrainSelectionForm.tsx";
import { BrainSelectionFields } from "../enums/brainSelectionFields.ts";
import { FileMap } from "../enums/fileMap.ts";
import { UserBrains } from "../types/brain.ts";
import { define } from "../utils.ts";


export const handler = define.handlers({
	async POST(ctx) {
		const form = await ctx.req.formData();
		const brainName = form.get(BrainSelectionFields.BRAIN);
		const isProduction = Deno.env.get("IS_PRODUCTION") === "true";
		const maxAge = 60 * 60 * 6; // Six hours in seconds.


		if (!brainName || typeof brainName !== "string") {
			return new Response("You failed to name your brain!", { status: 400 });
		}

		const headers = new Headers();
		headers.set(
			"Set-Cookie",
			`brainName=${brainName}; HttpOnly; ${isProduction ? "Secure;": ""} Path=/; Max-Age=${maxAge} SameSite=Lax`,
		);

		headers.set("Location", "/");


		return new Response(null, {
			status: 303,
			headers,
		});
	},
});


export default define.page( async function SelectBrain(_ctx) {
	const userBrains: UserBrains = JSON.parse(await Deno.readTextFile(FileMap.BRAIN));
	const brainNames = Object.keys(userBrains);
	console.log(brainNames)
	
	return (
		<div class="flex flex-col font-cherrybomb text-4xl items-center">
			<h1 class="font-logo text-8xl">SELECT A BRAIN</h1>
			<div class="flex flex-col items-start">
				{
					brainNames.map((x, y) => <BrainSelectionForm brainName={x} key={y}/>)
				}
			</div>
		</div>
	);
});
