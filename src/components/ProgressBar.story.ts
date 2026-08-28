import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * ProgressBar.story.ts — индикатор прогресса для уроков и треков
 * operator: glow-border с CRT-эффектами
 * tty: ASCII-индикатор с символами
 */
const story: HistoireVanillaStory = {
  title: "ProgressBar",
  icon: "carbon:progress-bar",
  variants: [
    {
      id: "operator-progress",
      title: "Operator Progress Bar",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 24px;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted);">
                <span>MODULE M1: REGISTERS</span>
                <span>75%</span>
              </div>
              <div style="height: 8px; background: var(--bg-code); border: 1px solid var(--line-secondary); border-radius: var(--radius-sm); overflow: hidden;">
                <div style="height: 100%; width: 75%; background: var(--acc-primary); box-shadow: var(--glow-primary);"></div>
              </div>
              <div style="margin-top: 8px; font-size: 10px; color: var(--ink-dim);">6 of 8 lessons completed</div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted);">
                <span>MODULE M2: MEMORY</span>
                <span>42%</span>
              </div>
              <div style="height: 8px; background: var(--bg-code); border: 1px solid var(--line-secondary); border-radius: var(--radius-sm); overflow: hidden;">
                <div style="height: 100%; width: 42%; background: var(--acc-medium);"></div>
              </div>
              <div style="margin-top: 8px; font-size: 10px; color: var(--ink-dim);">3 of 7 lessons completed</div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted);">
                <span>MODULE M3: STACK</span>
                <span>0%</span>
              </div>
              <div style="height: 8px; background: var(--bg-code); border: 1px solid var(--line-secondary); border-radius: var(--radius-sm); overflow: hidden;">
                <div style="height: 100%; width: 0%; background: transparent;"></div>
              </div>
              <div style="margin-top: 8px; font-size: 10px; color: var(--ink-muted);">Locked — complete M2 first</div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted);">
                <span>MODULE M4: CONTROL FLOW</span>
                <span>100%</span>
              </div>
              <div style="height: 8px; background: var(--bg-code); border: 1px solid var(--line-secondary); border-radius: var(--radius-sm); overflow: hidden;">
                <div style="height: 100%; width: 100%; background: var(--acc-dim);"></div>
              </div>
              <div style="margin-top: 8px; font-size: 10px; color: var(--ink-ghost);">Completed</div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-progress",
      title: "TTY Progress Bar (ASCII)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 660px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[PROGRESS_TRACK]────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  [M1] REGISTERS     [███████████████████████████████████░░░░░░░░░░░░░░] 75%</div>
<div>│                      <span class="tty-row-complete">6 of 8 lessons completed</span></div>
<div>│</div>
<div>│  [M2] MEMORY        [████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 42%</div>
<div>│                      <span class="tty-row-active">3 of 7 lessons completed</span></div>
<div>│</div>
<div>│  [M3] STACK         [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%</div>
<div>│                      <span class="tty-row-locked">Locked — complete M2 first</span></div>
<div>│</div>
<div>│  [M4] CONTROL FLOW [██████████████████████████████████████████████████] 100%</div>
<div>│                      <span class="tty-row-ready">Completed</span></div>
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
