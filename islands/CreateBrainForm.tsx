import { CreateBrainsFields } from "../enums/createBrainsFields.ts";

export default function CreateBrainForm({url}: {url: string}) {
	return (
		<form method="POST" action={url}>
			<label for={CreateBrainsFields.NAME} class="font-cherrybomb text-brain-pink text-3xl block">NAME YOUR BRAIN</label>
			<input 
				class="bg-white font-quantico text-black w-102 pl-2 rounded-xl" 
				name={CreateBrainsFields.NAME} id={CreateBrainsFields.NAME}
				placeholder="Name Your Brain. Brain names have to be unique."
				required
			/>
			<label for="context" class="font-cherrybomb text-brain-pink text-3xl mt-10 block">GIVE YOUR BRAIN A CONTEXT</label>
			<textarea 
			onKeyDown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					e.currentTarget.form?.requestSubmit();
				}
			}}
				class="bg-white font-quantico text-black w-104 pl-2 rounded-lg" 
				name={CreateBrainsFields.CONTEXT}
				id={CreateBrainsFields.CONTEXT} 
				placeholder="Your Brain Context Goes Here. Be thorough"
				required 
			/>
			<p class="font-cherrybomb text-brain-pink text-3xl mt-10 block">CHOOSE YOUR BRAIN MODEL</p>
			<label for="gpt-5-nano" class="font-quantico text-xl">
				GPT 5 Nano
				<input type="radio" name={CreateBrainsFields.MODEL} id="gpt-5-nano" value="gpt-5-nano" class="mr-8" defaultChecked/>
			</label>
			<label for="gpt-4-nano" class="font-quantico text-xl">
				GPT 4 Nano
				<input type="radio" name={CreateBrainsFields.MODEL} id="gpt-4-nano" value="gpt-4-nano" />
			</label>
			<button type="submit" hidden>Submit</button>
		</form>
	);
}
