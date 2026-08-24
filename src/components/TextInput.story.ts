import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * TextInput.story.ts — поле ввода с $-промптом
 * operator: панель с рамкой, placeholder «Введите ответ», focus-состояние
 * tty: строка с промптом и курсором-блоком
 */
const story: HistoireVanillaStory = {
  title: "TextInput",
  icon: "carbon:input",
  variants: [
    {
      id: "operator-input",
      title: "Operator TextInput",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-input">
              <span class="operator-input-prompt">$</span>
              <input class="operator-input-field" type="text" placeholder="Введите ответ" />
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-input",
      title: "TTY TextInput (Block Cursor)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
              <div class="tty-input">
                <span class="tty-input-prompt">operator@asm:/m1/q2$ </span>
                <input class="tty-input-field" type="text" placeholder="Введите ответ" />
                <span class="tty-input-cursor"></span>
              </div>
            </div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
