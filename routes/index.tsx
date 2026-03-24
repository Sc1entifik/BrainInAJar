import { define } from "../utils.ts";
import MainMenuLinks from "../components/MainMenuLinks.tsx";
import BrainInAJarLogo from "../components/BrainInAJarLogo.tsx";

export default define.page(function Home(_ctx) {
  return (
    <div class="flex flex-col px-4 py-8 mx-auto bg-bubble-gum-blue h-screen">
      <BrainInAJarLogo />
      <div class="h-1/5"></div>
      <div class="flex flex-col flex-1 items-center">
        <MainMenuLinks />
      </div>
    </div>
  );
});
