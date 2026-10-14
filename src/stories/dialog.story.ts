import { createStory } from "./shared";
import { pages } from "./pages";
export default createStory(pages.find((page) => page.id === "dialog")!);
