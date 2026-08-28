import "../styles/ui.css";
import "../styles/skins/operator.css";
import "../styles/skins/tty.css";
import type { HistoireVanillaStory } from "../histoire.d";
import { createTooltip } from "../core/Tooltip";

const story: HistoireVanillaStory = {
  title: "Tooltip",
  icon: "carbon:tooltip",
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

        const instance = createTooltip({
          text: "Hex notation: 0x2A = 42",
          side: "top",
        });
        const opTrigger = document.createElement("button");
        opTrigger.textContent = "0x2A";
        opTrigger.style.cssText =
          "padding: 8px 12px; border: 1px solid var(--line-primary); background: var(--panel-bg); color: var(--ink-secondary); font-family: var(--font-mono);";
        instance.attach(opTrigger);
        opWrap.appendChild(opTrigger);

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

        const ttyInstance = createTooltip({
          text: "Hex notation: 0x2A = 42",
          side: "top",
        });
        const ttyTrigger = document.createElement("button");
        ttyTrigger.textContent = "0x2A";
        ttyTrigger.style.cssText =
          "padding: 8px 12px; border: 1px solid var(--line-primary); background: var(--panel-bg); color: var(--ink-secondary); font-family: var(--font-mono);";
        ttyInstance.attach(ttyTrigger);
        ttyWrap.appendChild(ttyTrigger);

        ttyContainer.appendChild(ttyWrap);

        el.appendChild(opContainer);
        el.appendChild(ttyContainer);
      },
    },
  ],
};

export default story;
