import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Feedback.story.ts — результат проверки шага
 * ok: «Process exited with code 0» с зелёным бордером
 * fail: «Segmentation fault (core dumped)» красным
 */
const story: HistoireVanillaStory = {
  title: "Feedback",
  icon: "carbon:checkmark-outline",
  variants: [
    {
      id: "operator-feedback-ok",
      title: "Operator Feedback OK",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-feedback pass" style="max-width: 620px;">
              <div class="operator-feedback-header">
                <span>PROCESS EXITED WITH CODE 0</span>
                <span>OK</span>
              </div>
              <div class="operator-feedback-body">
                <p class="operator-feedback-text">
                  Верно. После второго mov RAX равен 7: перезапись, а не сложение — регистры не аккумулируют.
                </p>
                <div class="operator-feedback-line">Process exited with code 0</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "operator-feedback-fail",
      title: "Operator Feedback Fail",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-feedback fail" style="max-width: 620px;">
              <div class="operator-feedback-header">
                <span>SEGMENTATION FAULT (CORE DUMPED)</span>
                <span>FAIL</span>
              </div>
              <div class="operator-feedback-body">
                <p class="operator-feedback-text">
                  Не гладко. Разыменование неинициализированного указателя ушло в ядро — адрес не принадлежит процессу.
                </p>
                <div class="operator-feedback-line">Segmentation fault (core dumped)</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-feedback-ok",
      title: "TTY Feedback OK",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
              <div class="tty-feedback pass">
                <div class="tty-feedback-border">┌─[RESULT]──────────────────────────────────────────────────────────────┐</div>
                <div class="tty-feedback-header"><span>PROCESS EXITED WITH CODE 0</span><span>OK</span></div>
                <div class="tty-feedback-border">├───────────────────────────────────────────────────────────────────────┤</div>
                <div class="tty-feedback-text">Верно. После второго mov RAX равен 7: перезапись, а не сложение.</div>
                <div class="tty-feedback-line">Process exited with code 0</div>
                <div class="tty-feedback-border">└───────────────────────────────────────────────────────────────────────┘</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-feedback-fail",
      title: "TTY Feedback Fail",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
              <div class="tty-feedback fail">
                <div class="tty-feedback-border">┌─[RESULT]──────────────────────────────────────────────────────────────┐</div>
                <div class="tty-feedback-header"><span>SEGMENTATION FAULT (CORE DUMPED)</span><span>FAIL</span></div>
                <div class="tty-feedback-border">├───────────────────────────────────────────────────────────────────────┤</div>
                <div class="tty-feedback-text">Не гладко. Разыменование неинициализированного указателя ушло в ядро.</div>
                <div class="tty-feedback-line">Segmentation fault (core dumped)</div>
                <div class="tty-feedback-border">└───────────────────────────────────────────────────────────────────────┘</div>
              </div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
