import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Spinner.story.ts — индикаторы загрузки
 * operator: CRT-spinner с glow-анимацией
 * tty: ASCII-spinner с вращающимися символами
 */
const story: HistoireVanillaStory = {
  title: "Spinner",
  icon: "carbon:loading",
  variants: [
    {
      id: "operator-spinner",
      title: "Operator Spinner (CRT)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="width: 24px; height: 24px; border: 2px solid var(--line-faint); border-top-color: var(--acc-primary); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <div style="font-size: 13px; color: var(--ink-secondary);">Assembling code...</div>
            </div>

            <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="width: 24px; height: 24px; border: 2px solid var(--line-faint); border-top-color: var(--info-primary); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <div style="font-size: 13px; color: var(--ink-secondary);">Running tests...</div>
            </div>

            <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
              <div style="width: 24px; height: 24px; border: 2px solid var(--line-faint); border-top-color: var(--warn-primary); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <div style="font-size: 13px; color: var(--ink-secondary);">Validating output...</div>
            </div>
          </div>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        `;
      },
    },
    {
      id: "tty-spinner",
      title: "TTY Spinner (Rotating Chars)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 580px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[SYSTEM_STATUS]────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  <span style="animation: rotate 1s steps(4) infinite;">/</span> Assembling code...</div>
<div>│  <span style="animation: rotate 1s steps(4) infinite;">-</span> Running tests...</div>
<div>│  <span style="animation: rotate 1s steps(4) infinite;">\\</span> Validating output...</div>
<div>│</div>
<div>│  [1/3] Assembler check: <span class="tty-row-ready">PASS</span></div>
<div>│  [2/3] Linker check:   <span class="tty-row-active">RUNNING</span></div>
<div>│  [3/3] Runtime check: <span class="tty-row-locked">WAITING</span></div>
<div>│</div>
<div class="tty-border-bottom">└──────────────────────────────────────────────────────────────────────────────┘</div>
            </div>
          </div>
          <style>
            @keyframes rotate {
              0%, 24% { content: "/"; }
              25%, 49% { content: "-"; }
              50%, 74% { content: "\\"; }
              75%, 100% { content: "|"; }
            }
          </style>
        `;
      },
    },
  ],
};

export default story;
