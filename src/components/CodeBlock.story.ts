import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * CodeBlock.story.ts — блок кода с подсветкой строк
 * operator: gutter с номерами + левый бордер у активной строки
 * tty: ASCII-рамка + box-drawing
 */
const story: HistoireVanillaStory = {
  title: "CodeBlock",
  icon: "carbon:terminal",
  variants: [
    {
      id: "operator-codeblock",
      title: "Operator CodeBlock",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-codeblock" style="max-width: 620px;">
              <div class="operator-codeblock-gutter">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
              </div>
              <div class="operator-codeblock-content">
                <div class="operator-codeblock-line">section .data</div>
                <div class="operator-codeblock-line">    msg db "hello, asm", 10</div>
                <div class="operator-codeblock-line operator-codeblock-line-hl">    len equ $ - msg</div>
                <div class="operator-codeblock-line">section .text</div>
                <div class="operator-codeblock-line">    global _start</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-codeblock",
      title: "TTY CodeBlock (ASCII Frame)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
<div class="tty-codeblock">
<div class="tty-border-top">┌─[src/main.asm]────────────────────────────────────────────────────────┐</div>
<div><span class="tty-codeblock-prefix">$</span> cat src/main.asm</div>
<div> 1  section .data</div>
<div> 2      msg db "hello, asm", 10</div>
<div class="tty-codeblock-line-hl"> 3      len equ $ - msg</div>
<div> 4  section .text</div>
<div> 5      global _start</div>
<div class="tty-border-bottom">└───────────────────────────────────────────────────────────────────────┘</div>
</div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
