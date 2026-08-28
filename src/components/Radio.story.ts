import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Radio.story.ts — радио-кнопки для выбора одного варианта из нескольких
 * operator: CRT-radio с glow-border
 * tty: ASCII-radio с круглыми скобками
 */
const story: HistoireVanillaStory = {
  title: "Radio",
  icon: "carbon:radio-button",
  variants: [
    {
      id: "operator-radio",
      title: "Operator Radio Group",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 24px;">
            <div style="padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); margin-bottom: 12px;">EXECUTION MODE</div>

              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 18px; height: 18px; border: 2px solid var(--acc-primary); border-radius: 50%; position: relative; cursor: pointer; box-shadow: var(--glow-primary);">
                  <div style="position: absolute; inset: 4px; background: var(--acc-primary); border-radius: 50%;"></div>
                </div>
                <div style="font-size: 13px; color: var(--acc-primary);">Normal execution</div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 18px; height: 18px; border: 2px solid var(--line-modal); border-radius: 50%; position: relative; cursor: pointer;"></div>
                <div style="font-size: 13px; color: var(--ink-secondary);">Debug with GDB</div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 18px; height: 18px; border: 2px solid var(--line-modal); border-radius: 50%; position: relative; cursor: pointer;"></div>
                <div style="font-size: 13px; color: var(--ink-secondary);">Step-by-step</div>
              </div>
            </div>

            <div style="padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); margin-bottom: 12px;">SYSCALL ABI</div>

              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 18px; height: 18px; border: 2px solid var(--line-modal); border-radius: 50%; position: relative; cursor: pointer;"></div>
                <div style="font-size: 13px; color: var(--ink-secondary);">System V AMD64</div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 18px; height: 18px; border: 2px solid var(--acc-primary); border-radius: 50%; position: relative; cursor: pointer; box-shadow: var(--glow-primary);">
                  <div style="position: absolute; inset: 4px; background: var(--acc-primary); border-radius: 50%;"></div>
                </div>
                <div style="font-size: 13px; color: var(--acc-primary);">Linux x86-64</div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 18px; height: 18px; border: 2px solid var(--line-modal); border-radius: 50%; position: relative; cursor: pointer;"></div>
                <div style="font-size: 13px; color: var(--ink-secondary);">BSD</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-radio",
      title: "TTY Radio (Parentheses)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 580px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[RADIO_SELECTION]────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  EXECUTION MODE</div>
<div>│  <span class="tty-row-active">(●)</span> Normal execution</div>
<div>│  ( ) Debug with GDB</div>
<div>│  ( ) Step-by-step</div>
<div>│</div>
<div>│  SYSCALL ABI</div>
<div>│  ( ) System V AMD64</div>
<div>│  <span class="tty-row-active">(●)</span> Linux x86-64</div>
<div>│  ( ) BSD</div>
<div>│</div>
<div>│  [1-3] Select mode | [4-6] Select ABI | [ENTER] Confirm</div>
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
