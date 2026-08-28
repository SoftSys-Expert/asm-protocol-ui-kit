import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Checkbox.story.ts — галочки выбора для опций
 * operator: CRT-checkbox с glow-border
 * tty: ASCII-галочки с квадратными скобками
 */
const story: HistoireVanillaStory = {
  title: "Checkbox",
  icon: "carbon:checkbox",
  variants: [
    {
      id: "operator-checkbox",
      title: "Operator Checkbox",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="width: 18px; height: 18px; background: var(--acc-primary); border: 1px solid var(--acc-primary); border-radius: 2px; display: flex; align-items: center; justify-content: center; box-shadow: var(--glow-primary);">
                <div style="width: 8px; height: 4px; background: var(--bg-dark); transform: rotate(-45deg); border-right: 2px solid var(--bg-dark); border-bottom: 2px solid var(--bg-dark);"></div>
              </div>
              <div style="font-size: 13px; color: var(--ink-secondary);">Enable compiler warnings</div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="width: 18px; height: 18px; background: transparent; border: 1px solid var(--line-modal); border-radius: 2px; cursor: pointer;"></div>
              <div style="font-size: 13px; color: var(--ink-secondary);">Generate debug symbols</div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="width: 18px; height: 18px; background: var(--bg-code); border: 1px solid var(--line-faint); border-radius: 2px; cursor: not-allowed;"></div>
              <div style="font-size: 13px; color: var(--ink-muted);">Optimize for size (Pro only)</div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="width: 18px; height: 18px; background: var(--bg-code); border: 1px solid var(--line-faint); border-radius: 2px; cursor: not-allowed;"></div>
              <div style="font-size: 13px; color: var(--ink-muted);">Enable sanitizers (locked)</div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-checkbox",
      title: "TTY Checkbox (ASCII Brackets)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 560px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[BUILD_OPTIONS]─────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  <span class="tty-row-active">[X]</span> Enable compiler warnings</div>
<div>│  [ ] Generate debug symbols</div>
<div>│  [ ] Optimize for size <span class="tty-row-locked">(Pro only)</span></div>
<div>│  [ ] Enable sanitizers <span class="tty-row-locked">(locked)</span></div>
<div>│</div>
<div>│  <span class="tty-row-ready">[SPACE] to toggle | [ENTER] to build</span></div>
<div>│</div>
<div class="tty-border-bottom">└──────────────────────────────────────────────────────────────────────────────┘</div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
