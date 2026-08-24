import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * OptionList.story.ts — варианты ответа с состояниями
 * default / hover (демо через CSS) / selected-correct (зелёный) / selected-wrong (красный) / disabled
 */
const story: HistoireVanillaStory = {
  title: "OptionList",
  icon: "carbon:list",
  variants: [
    {
      id: "operator-optionlist",
      title: "Operator OptionList",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 10px; max-width: 620px;">
            <div class="operator-option" role="button" tabindex="0">
              <span class="operator-option-key">1</span>
              <span class="operator-option-text">RAX держит 7 — последний mov перезаписал всё</span>
              <span class="operator-option-mark">✓</span>
            </div>
            <div class="operator-option selected" role="button" tabindex="0">
              <span class="operator-option-key">2</span>
              <span class="operator-option-text">RAX держит 12 — mov складывает значения</span>
              <span class="operator-option-mark">✓</span>
            </div>
            <div class="operator-option selected fail" role="button" tabindex="0">
              <span class="operator-option-key">3</span>
              <span class="operator-option-text">RAX держит 5 — регистры аккумулируют</span>
              <span class="operator-option-mark">✗</span>
            </div>
            <div class="operator-option disabled" role="button" tabindex="-1" aria-disabled="true">
              <span class="operator-option-key">4</span>
              <span class="operator-option-text">Вариант недоступен до m2</span>
              <span class="operator-option-mark">·</span>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-optionlist",
      title: "TTY OptionList",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div class="tty-option">
                  <span class="tty-option-key">[1]</span>
                  <span class="tty-option-text">RAX держит 7 — последний mov перезаписал всё</span>
                  <span class="tty-option-mark">✓</span>
                </div>
                <div class="tty-option selected">
                  <span class="tty-option-key">[2]</span>
                  <span class="tty-option-text">RAX держит 12 — mov складывает значения</span>
                  <span class="tty-option-mark">✓</span>
                </div>
                <div class="tty-option selected fail">
                  <span class="tty-option-key">[3]</span>
                  <span class="tty-option-text">RAX держит 5 — регистры аккумулируют</span>
                  <span class="tty-option-mark">✗</span>
                </div>
                <div class="tty-option disabled">
                  <span class="tty-option-key">[4]</span>
                  <span class="tty-option-text">Вариант недоступен до m2</span>
                  <span class="tty-option-mark">·</span>
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
