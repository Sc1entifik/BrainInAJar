import { define } from "../utils.ts";

interface Brain {
	context: string;
	user: string;
	agent: string;
	vectorStoreId?: string;
}

export default define.page(() => {
	return (
		<main>
			<h1>Create A New Brain!</h1>
		</main>
	);
		
});
