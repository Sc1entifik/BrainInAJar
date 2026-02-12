import { define } from "../utils.ts";
import BrainLogo from "../components/BrainInAJarLogo.tsx";
import MainMenuLinks from "../components/MainMenuLinks.tsx";


export default define.page(function Home(_ctx) {
  return (
    <div class="flex flex-col px-4 py-8 mx-auto bg-bubble-gum-blue h-screen">
			<BrainLogo />
			<div class="h-1/5"></div>
			<div class="flex flex-col flex-1 items-center">
				<MainMenuLinks />
			</div>
    </div>
  );
});
