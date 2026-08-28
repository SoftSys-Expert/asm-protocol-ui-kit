import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Toggle.story.ts — переключатель режимов и опций
 * operator: CRT-toggle с glow-эффектами
 * tty: ASCII-переключатель с квадратными скобками
 */
const story: HistoireVanillaStory = {
  title: "Toggle",
  icon: "carbon:toggle",
  variants: [
    {
      id: "operator-toggle",
      title: "Operator Toggle Switch",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div>
                <div style="font-size: 13px; color: var(--ink-secondary); margin-bottom: 4px;">CRT Effects</div>
                <div style="font-size: 11px; color: var(--ink-dim);">Enable scanlines and glow animations</div>
              </div>
              <div style="width: 44px; height: 24px; background: var(--acc-primary); border-radius: 12px; position: relative; cursor: pointer; box-shadow: var(--glow-primary);">
                <div style="position: absolute; right: 2px; top: 2px; width: 20px; height: 20px; background: var(--bg-dark); border-radius: 50%; border: 1px solid var(--acc-primary);"></div>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div>
                <div style="font-size: 13px; color: var(--ink-secondary); margin-bottom: 4px;">Auto-save</div>
                <div style="font-size: 11px; color: var(--ink-dim);">Save code after every check</div>
              </div>
              <div style="width: 44px; height: 24px; background: var(--acc-darker); border-radius: 12px; position: relative; cursor: pointer;">
                <div style="position: absolute; left: 2px; top: 2px; width: 20px; height: 20px; background: var(--ink-muted); border-radius: 50%;"></div>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md); opacity: 0.5;">
              <div>
                <div style="font-size: 13px; color: var(--ink-muted); margin-bottom: 4px;">Pro Mode</div>
                <div style="font-size: 11px; color: var(--ink-ghost);">Advanced debugging features</div>
              </div>
              <div style="width: 44px; height: 24px; background: var(--bg-code); border-radius: 12px; position: relative; cursor: not-allowed;">
                <div style="position: absolute; left: 2px; top: 2px; width: 20px; height: 20px; background: var(--ink-muted); border-radius: 50%;"></div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-toggle",
      title: "TTY Toggle (ASCII Brackets)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 560px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[SETTINGS]───────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  CRT Effects          <span class="tty-row-active">[ON]</span>  Enable scanlines and glow animations</div>
<div>│  Auto-save            [OFF] Save code after every check</div>
<div>│  Pro Mode             [OFF] Advanced debugging features</div>
<div>│</div>
<div>│  <span class="tty-row-locked">[LOCKED] Complete M2 to unlock Pro Mode</span></div>
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
