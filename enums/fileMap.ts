const root = new URL("../", import.meta.url).pathname;

export const FileMap = {
  DATA_DIR: `${root}data/`,
  BRAIN: `${root}data/brain.json`,
  BRAIN_FOOD: `${root}data/brainFood/`,
  LOGO: "/brainLogo.svg",
};
