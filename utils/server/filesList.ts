import { FileMap } from "../../enums/fileMap.ts";

export default async function brainFoodFiles() {
	const brainFood = await Array.fromAsync(Deno.readDir(FileMap.BRAIN_FOOD));
	
	return brainFood.filter(x => x.isFile ).map(x => x.name)
}
