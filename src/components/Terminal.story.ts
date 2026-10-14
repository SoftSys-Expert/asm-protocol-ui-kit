import "../styles/ui.css";
import "../styles/skins/operator.css";
import "../styles/skins/tty.css";
import type { HistoireVanillaStory } from "../histoire.d";
import { createTerminal } from "../core/Terminal";

const story: HistoireVanillaStory = {
  title: "Terminal",
  icon: "carbon:terminal",
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

        const instance = createTerminal({ title: "Build Output", height: 240 });
        instance.appendLine("stdout", "nasm -f elf64 main.asm");
        instance.appendLine("stdout", "ld -o main main.o");
        instance.setExit(0);
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

        const ttyInstance = createTerminal({ title: "Build Output", height: 240 });
        ttyInstance.appendLine("stdout", "nasm -f elf64 main.asm");
        ttyInstance.appendLine("stdout", "ld -o main main.o");
        ttyInstance.setExit(0);
        ttyWrap.appendChild(ttyInstance.el);

        ttyContainer.appendChild(ttyWrap);

        el.appendChild(opContainer);
        el.appendChild(ttyContainer);
      },
    },
  ],
};

export default story;
