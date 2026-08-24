import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * ModeSwitch.story.ts — сегментный переключатель режимов
 * Script Kiddie / Console Cowboy, is-on состояние
 */
const story: HistoireVanillaStory = {
  title: "ModeSwitch",
  icon: "carbon:switch",
  variants: [
    {
      id: "operator-modeswitch",
      title: "Operator ModeSwitch",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-mode-switch">
              <button class="operator-mode-tab is-on" type="button">SCRIPT KIDDIE</button>
              <button class="operator-mode-tab" type="button">CONSOLE COWBOY</button>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-modeswitch",
      title: "TTY ModeSwitch",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
              <div class="tty-mode-switch">
                <button class="tty-mode-tab active" type="button">[script_kiddie]</button>
                <button class="tty-mode-tab" type="button">[console_cowboy]</button>
              </div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
