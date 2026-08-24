import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Button.story.ts — Histoire vanilla story для компонента Button
 */
const story: HistoireVanillaStory = {
  title: "Button",
  icon: "carbon:button",
  variants: [
    {
      id: "operator-primary",
      title: "Operator Primary",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <button class="operator-btn-primary" type="button">
              Run
            </button>
          </div>
        `;
      },
    },
    {
      id: "operator-secondary",
      title: "Operator Secondary",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <button class="operator-btn-secondary" type="button">
              Cancel
            </button>
          </div>
        `;
      },
    },
    {
      id: "operator-link",
      title: "Operator Link",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <button class="operator-btn-link" type="button">
              Back to map
            </button>
          </div>
        `;
      },
    },
    {
      id: "tty-link",
      title: "TTY Link",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #050705; font-family: 'IBM Plex Mono', monospace; font-size: 13.5px; line-height: 22px;">
            <pre style="margin: 0; color: #6E7E77;">operator@asm:/map$ <button class="tty-btn" type="button">cd m1</button><span style="animation: blink 1s steps(1) infinite; color: #72F2B0;">█</span></pre>
          </div>
        `;
      },
    },
  ],
};

export default story;
