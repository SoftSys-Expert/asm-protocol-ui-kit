import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Badge.story.ts — маленькие индикаторы
 * LOCAL SESSION, OK, FAIL, NEW
 */
const story: HistoireVanillaStory = {
  title: "Badge",
  icon: "carbon:tag",
  variants: [
    {
      id: "operator-badges",
      title: "Operator Badges",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <span class="operator-badge operator-badge-session">LOCAL SESSION</span>
            <span class="operator-badge complete">OK</span>
            <span class="operator-badge fail">FAIL</span>
            <span class="operator-badge new">NEW</span>
          </div>
        `;
      },
    },
    {
      id: "tty-badges",
      title: "TTY Badges",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
              <span class="tty-badge tty-badge-session">[LOCAL SESSION]</span>
              <span class="tty-badge complete">[OK]</span>
              <span class="tty-badge fail">[FAIL]</span>
              <span class="tty-badge new">[NEW]</span>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
