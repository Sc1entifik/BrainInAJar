import { define } from "../utils.ts";
import { FileMap } from "../enums/fileMap.ts";
import { UserBrains } from "../types/brain.ts";
import CreateBrainForm from "../islands/CreateBrainForm.tsx";
import { CreateBrainsFields } from "../enums/createBrainsFields.ts";


export const handler = define.handlers({
	async POST(ctx) {
		const form = await ctx.req.formData();
		const name = form.get(CreateBrainsFields.NAME);
		const context = form.get(CreateBrainsFields.CONTEXT);
		const model = form.get(CreateBrainsFields.MODEL);
		const userBrains: UserBrains = JSON.parse(await Deno.readTextFile(FileMap.BRAIN));

		if (typeof name === "string" && typeof context === "string" && typeof model === "string"){
			if (!Object.hasOwn(userBrains, name)) {
				userBrains[name] = {
					context,
					user: [""],
					agent: [""],
					model,
				}

				Deno.writeTextFile(FileMap.BRAIN, JSON.stringify(userBrains));
			}
		}

		const headers = new Headers();
		headers.set("location", "/createBrain");
		return new Response(null, { status: 303, headers });
	},
});


export default define.page(async () => {
	const userBrains: UserBrains = JSON.parse(await Deno.readTextFile(FileMap.BRAIN));
	const brainList = Object.keys(userBrains);


	return (
		<div class="flex flex-col items-center pt-9 gap-6">
			<h1 class="text-center text-brain-pink text-6xl font-logo">CREATE A NEW BRAIN!</h1>
			<div>
				<h2 class="text-brain-pink font-cherrybomb text-4xl ">YOUR CURRENT BRAINS</h2>
				<p class="text-black text-xl">All brain names have to be unique.</p>
			</div>
			{
				brainList.length === 0 ? <p class="font-chakra text-brain-text font-bold text-2xl">You currently have no brains! Don't worry you are in the right place!</p>: brainList.map((x, y) => 
					<p class="text-brain-text font-chakra text-2xl" key={y}>{x}</p>
				)
			}
			<CreateBrainForm url="/createBrain"/>
		</div>
	);
		
});
