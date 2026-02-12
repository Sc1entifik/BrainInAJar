import { FileMap } from "../enums/fileMap.ts";

export default function BrainLogo() {
	return (
		<div class="flex w-2xl mx-auto items-end gap-7">
			<img src={FileMap.LOGO} alt="Cartoon image of a brain in a jar." class="w-72"   />
			<h1 class="text-8xl text-brain-pink font-bold font-logo">BRAIN IN A JAR</h1>
		</div>
	);
}
