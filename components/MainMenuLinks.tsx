import { SiteMap } from "../enums/siteMap.ts";

export default function MainMenuLinks() {
	const linkAndDescription: [string, string][] = [[SiteMap.CREATE_BRAIN,"CREATE A BRAIN"], [SiteMap.FEED_BRAIN,"FEED A BRAIN"], [SiteMap.TALK_TO_A_BRAIN, "TALK TO A BRAIN"], [SiteMap.TUTORIAL, "TUTORIAL"]].map((x, y) =>  
			<a
				href={x[0]} 
				key={y} 
				class="font-cherrybomb text-4xl text-brain-text hover:text-brain-pink"
			>{x[1]}</a>
		);

	return (
		<div class="flex flex-col flex-1 justify-between items-start h-fit">
			{linkAndDescription}
		</div>
	);
}
