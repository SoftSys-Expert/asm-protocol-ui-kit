import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Slider.story.ts — ползунок для настройки значений
 * operator: CRT-slider с glow-border
 * tty: ASCII-ползунок с символами
 */
const story: HistoireVanillaStory = {
  title: "Slider",
  icon: "carbon:slider",
  variants: [
    {
      id: "operator-slider",
      title: "Operator Slider",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 28px;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted);">
                <span>OPTIMIZATION LEVEL</span>
                <span style="color: var(--acc-primary);">O2</span>
              </div>
              <input type="range" min="0" max="3" value="2" style="width: 100%; height: 8px; background: var(--bg-code); border: 1px solid var(--line-secondary); border-radius: var(--radius-sm); outline: none; cursor: pointer;">
              <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: var(--ink-dim);">
                <span>O0</span>
                <span>O1</span>
                <span>O2</span>
                <span>O3</span>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted);">
                <span>BUFFER SIZE</span>
                <span style="color: var(--info-primary);">4096 bytes</span>
              </div>
              <input type="range" min="1024" max="16384" step="512" value="4096" style="width: 100%; height: 8px; background: var(--bg-code); border: 1px solid var(--line-secondary); border-radius: var(--radius-sm); outline: none; cursor: pointer;">
              <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: var(--ink-dim);">
                <span>1KB</span>
                <span>4KB</span>
                <span>8KB</span>
                <span>16KB</span>
              </div>
            </div>

            <div style="opacity: 0.5;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-ghost);">
                <span>STACK SIZE (Pro)</span>
                <span style="color: var(--ink-ghost);">8192 bytes</span>
              </div>
              <input type="range" min="4096" max="32768" step="512" value="8192" disabled style="width: 100%; height: 8px; background: var(--bg-code); border: 1px solid var(--line-faint); border-radius: var(--radius-sm); outline: none; cursor: not-allowed;">
              <div style="margin-top: 8px; font-size: 10px; color: var(--ink-ghost);">Locked — complete M2 to adjust</div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-slider",
      title: "TTY Slider (ASCII Progress)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 620px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[SLIDER_CONTROLS]────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  OPTIMIZATION LEVEL</div>
<div>│  <span class="tty-row-ready">[O0]</span> <span class="tty-row-ready">[O1]</span> <span class="tty-row-active">[O2]</span> [O3]</div>
<div>│  <span class="tty-border-row">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○</span> 66%</div>
<div>│</div>
<div>│  BUFFER SIZE</div>
<div>│  <span class="tty-row-active">[1KB]</span> [4KB] [8KB] [16KB]</div>
<div>│  <span class="tty-border-row">━━━━━━━━━━━━━━○</span> 25%</div>
<div>│</div>
<div>│  STACK SIZE (Pro)</div>
<div>│  <span class="tty-row-locked">[4KB]</span> [8KB] [16KB] [32KB]</div>
<div>│  <span class="tty-row-locked">━━━━━━━━━━━━━━○ (locked)</span></div>
<div>│</div>
<div>│  [<] Decrease | [>] Increase | [SPACE] Toggle</div>
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
