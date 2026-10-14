import "../styles/ui.css";
import "../styles/skins/operator.css";
import "../styles/skins/tty.css";
import type { HistoireVanillaStory } from "../histoire.d";
import { createModal } from "../core/Modal";

const story: HistoireVanillaStory = {
  title: "Modal",
  icon: "carbon:modal",
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

        const content = document.createElement("div");
        content.textContent = "Reset all progress?";
        const instance = createModal({
          title: "Confirm Reset",
          content,
          confirmLabel: "Reset",
          cancelLabel: "Cancel",
        });
        const btn = document.createElement("button");
        btn.textContent = "Open Modal";
        btn.style.cssText =
          "padding: 10px 16px; background: var(--acc-darker); border: 1px solid var(--acc-primary); color: var(--acc-primary); font-family: var(--font-mono); cursor: pointer;";
        btn.addEventListener("click", () => instance.open());
        opWrap.appendChild(btn);
        document.body.appendChild(instance.el);

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

        const ttyContent = document.createElement("div");
        ttyContent.textContent = "Reset all progress?";
        const ttyInstance = createModal({
          title: "Confirm Reset",
          content: ttyContent,
          confirmLabel: "Reset",
          cancelLabel: "Cancel",
        });
        const ttyBtn = document.createElement("button");
        ttyBtn.textContent = "open modal";
        ttyBtn.style.cssText =
          "padding: 0; background: none; border: none; color: var(--acc-primary); font-family: var(--font-mono); text-decoration: underline; cursor: pointer;";
        ttyBtn.addEventListener("click", () => ttyInstance.open());
        ttyWrap.appendChild(ttyBtn);
        document.body.appendChild(ttyInstance.el);

        ttyContainer.appendChild(ttyWrap);

        el.appendChild(opContainer);
        el.appendChild(ttyContainer);
      },
    },
  ],
};

export default story;
