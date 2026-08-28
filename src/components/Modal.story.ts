import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Modal.story.ts — модальные диалоги для подтверждений и детальной информации
 * operator: CRT-модалка с glow-border и затемнением
 * tty: ASCII-модалка с box-drawing рамкой
 */
const story: HistoireVanillaStory = {
  title: "Modal",
  icon: "carbon:modal",
  variants: [
    {
      id: "operator-modal",
      title: "Operator Modal (Confirmation)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div style="position: fixed; inset: 0; background: rgb(7 10 9 / 85%); display: flex; align-items: center; justify-content: center; z-index: var(--z-modal);">
              <div class="operator-panel" style="max-width: 520px; box-shadow: var(--shadow-modal);">
                <div class="operator-panel-header">
                  <span style="color: var(--warn-primary);">CONFIRM_RESET</span>
                  <span style="color: var(--ink-faint);">M1_L03_POINTER</span>
                </div>
                <div class="operator-panel-content">
                  <div style="font-size: 14px; line-height: 1.6; color: var(--ink-medium); margin-bottom: 20px;">
                    <p style="margin: 0 0 12px;">Reset lesson progress to initial state?</p>
                    <p style="margin: 0; color: var(--ink-dim); font-size: 13px;">This action cannot be undone. All completed checks and code submissions will be lost.</p>
                  </div>
                  <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="operator-btn-secondary">Cancel</button>
                    <button class="operator-btn-primary" style="border-color: var(--fail-primary); color: var(--fail-primary);">Reset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-modal",
      title: "TTY Modal (ASCII Dialog)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 540px; height: 320px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[CONFIRM_RESET]────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  Reset lesson progress to initial state?</div>
<div>│</div>
<div>│  <span class="tty-row-locked">[WARNING] This action cannot be undone.</span></div>
<div>│  <span class="tty-row-locked">All completed checks and code submissions</span></div>
<div>│  <span class="tty-row-locked">will be lost.</span></div>
<div>│</div>
<div>│  ┌─────────────┐  ┌──────────┐</div>
<div>│  │ <span class="tty-row-active">[RESET]</span>      │  │ [CANCEL] │</div>
<div>│  └─────────────┘  └──────────┘</div>
<div>│</div>
<div>│  [M1_L03_POINTER]</div>
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
