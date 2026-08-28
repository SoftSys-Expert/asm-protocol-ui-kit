import "../styles/ui.css";
import "../styles/skins/operator.css";
import "../styles/skins/tty.css";
import type { HistoireVanillaStory } from "../histoire.d";
import { createBreadcrumbs } from "../core/Breadcrumbs";

const story: HistoireVanillaStory = {
  title: "Breadcrumbs",
  icon: "carbon:breadcrumbs",
  variants: [
    {
      id: "dual-skin",
      title: "Operator & TTY",
      onMount: ({ el }) => {
        // Operator skin
        const opContainer = document.createElement("div");
        opContainer.setAttribute("data-skin", "operator");
        opContainer.style.cssText = "padding: 20px; margin-bottom: 30px;";

        const opTitle = document.createElement("h3");
        opTitle.textContent = "Operator Skin";
        opTitle.style.cssText =
          "color: var(--acc-primary); margin-bottom: 16px; font-family: var(--font-mono);";
        opContainer.appendChild(opTitle);

        const opWrap = document.createElement("div");
        opWrap.style.cssText =
          "display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-start;";

        const instance = createBreadcrumbs({
          items: [
            { id: "m1", label: "Heap" },
            { id: "m1-l3", label: "Allocation" },
          ],
          separator: "/",
        });
        opWrap.appendChild(instance.el);

        opContainer.appendChild(opWrap);

        // TTY skin
        const ttyContainer = document.createElement("div");
        ttyContainer.setAttribute("data-skin", "tty");
        ttyContainer.style.cssText = "padding: 20px; position: relative;";

        const ttyTitle = document.createElement("h3");
        ttyTitle.textContent = "tty skin";
        ttyTitle.style.cssText =
          "color: var(--acc-primary); margin-bottom: 16px; font-family: var(--font-mono);";
        ttyContainer.appendChild(ttyTitle);

        const ttyWrap = document.createElement("div");
        ttyWrap.style.cssText =
          "display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-start;";

        const ttyInstance = createBreadcrumbs({
          items: [
            { id: "m1", label: "Heap" },
            { id: "m1-l3", label: "Allocation" },
          ],
          separator: "/",
        });
        ttyWrap.appendChild(ttyInstance.el);

        ttyContainer.appendChild(ttyWrap);

        el.appendChild(opContainer);
        el.appendChild(ttyContainer);
      },
    },
  ],
};

export default story;
