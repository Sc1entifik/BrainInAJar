import { FileMap } from "../enums/fileMap.ts";
import { UserBrains } from "../types/brain.ts";
import { define } from "../utils.ts";


export default define.page(async () => {
	const userBrains: UserBrains = JSON.parse(await Deno.readTextFile(FileMap.BRAIN));
	const brainList = Object.keys(userBrains);


	return (
		<main>
			<h1>Create A New Brain!</h1>
		</main>
	);
		
});
