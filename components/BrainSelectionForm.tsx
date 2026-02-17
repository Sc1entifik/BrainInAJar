import { BrainSelectionFields } from "../enums/brainSelectionFields.ts";
import { SiteMap } from "../enums/siteMap.ts";

export default function BrainSelectionForm({ brainName }: { brainName: string }) {
	return (
		<form method="POST" action={SiteMap.SELECT_A_BRAIN}>
			<input name={BrainSelectionFields.BRAIN} value={brainName} hidden />
			<button type="submit">{brainName}</button>
		</form>
	);
}
