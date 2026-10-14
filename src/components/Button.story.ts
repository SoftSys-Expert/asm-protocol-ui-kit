import "../styles/ui.css";
import "../styles/skins/operator.css";
import "../styles/skins/tty.css";
import type { HistoireVanillaStory } from "../histoire.d";
import { createButton } from "../core/Button";

const story: HistoireVanillaStory = {
  title: "Button",
  icon: "carbon:button",
  variants: [
    {
      id: "all-variants",
      title: "All Variants (Operator & TTY)",
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
        opWrap.style.cssText = "display: flex; gap: 12px; flex-wrap: wrap;";

        const primary = createButton({ label: "Run", variant: "primary" });
        const secondary = createButton({ label: "Cancel", variant: "secondary" });
        const ghost = createButton({ label: "Reset", variant: "ghost" });
        const danger = createButton({ label: "Delete", variant: "danger" });
        const link = createButton({ label: "Back to map", variant: "link" });

        opWrap.append(primary.el, secondary.el, ghost.el, danger.el, link.el);
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
        ttyWrap.style.cssText = "display: flex; gap: 12px; flex-wrap: wrap;";

        const ttyPrimary = createButton({ label: "execute", variant: "primary" });
        const ttySecondary = createButton({ label: "abort", variant: "secondary" });
        const ttyLink = createButton({ label: "cd ..", variant: "link" });

        ttyWrap.append(ttyPrimary.el, ttySecondary.el, ttyLink.el);
        ttyContainer.appendChild(ttyWrap);

        el.appendChild(opContainer);
        el.appendChild(ttyContainer);
      },
    },
  ],
};

export default story;
