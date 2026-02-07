import { Partial } from "fresh/runtime";
import { Countdown } from "../islands/Countdown.tsx";
import { define } from "../utils.ts";

export default define.page(() => {
	return (
		<Partial name="mylink">
			<h1>About</h1>
			<p>This is the about page.</p>
			<Countdown />
		</Partial>
	);
});
