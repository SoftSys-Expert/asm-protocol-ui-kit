import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Stats.story.ts — KPI-плитки для метрик выполнения (такты, мс, exit-code)
 * operator: CRT-плитки с glow-border
 * tty: ASCII-плитки с box-drawing рамкой
 */
const story: HistoireVanillaStory = {
  title: "Stats",
  icon: "carbon:chart-bar",
  variants: [
    {
      id: "operator-stats",
      title: "Operator Stats (KPI Cards)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 720px;">
              <div style="padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
                <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); margin-bottom: 12px;">CYCLES</div>
                <div style="font-size: 28px; color: var(--acc-bright); font-weight: 600; margin-bottom: 4px;">1,247</div>
                <div style="font-size: 11px; color: var(--ink-dim);">CPU clock cycles</div>
              </div>

              <div style="padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
                <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); margin-bottom: 12px;">EXECUTION TIME</div>
                <div style="font-size: 28px; color: var(--info-primary); font-weight: 600; margin-bottom: 4px;">0.42<span style="font-size: 18px;">ms</span></div>
                <div style="font-size: 11px; color: var(--ink-dim);">Total runtime</div>
              </div>

              <div style="padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
                <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); margin-bottom: 12px;">EXIT CODE</div>
                <div style="font-size: 28px; color: var(--acc-bright); font-weight: 600; margin-bottom: 4px;">0</div>
                <div style="font-size: 11px; color: var(--ink-dim);">Success (no errors)</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 720px; margin-top: 16px;">
              <div style="padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
                <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); margin-bottom: 12px;">CYCLES</div>
                <div style="font-size: 28px; color: var(--ink-secondary); font-weight: 600; margin-bottom: 4px;">3,892</div>
                <div style="font-size: 11px; color: var(--ink-dim);">CPU clock cycles</div>
              </div>

              <div style="padding: 16px; background: var(--panel-bg); border: 1px solid var(--line-primary); border-radius: var(--radius-md);">
                <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); margin-bottom: 12px;">EXECUTION TIME</div>
                <div style="font-size: 28px; color: var(--ink-secondary); font-weight: 600; margin-bottom: 4px;">1.85<span style="font-size: 18px;">ms</span></div>
                <div style="font-size: 11px; color: var(--ink-dim);">Total runtime</div>
              </div>

              <div style="padding: 16px; background: #100a0a; border: 1px solid #3a2222; border-radius: var(--radius-md);">
                <div style="font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--fail-primary); margin-bottom: 12px;">EXIT CODE</div>
                <div style="font-size: 28px; color: var(--fail-primary); font-weight: 600; margin-bottom: 4px;">139</div>
                <div style="font-size: 11px; color: var(--ink-dim);">SIGSEGV (segfault)</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-stats",
      title: "TTY Stats (ASCII Cards)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 740px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[EXECUTION_METRICS]───────────────────────────────────────────────────────────┐</div>
<div>│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐</div>
<div>│  │ CYCLES          │  │ EXECUTION TIME  │  │ EXIT CODE       │</div>
<div>│  │ <span class="tty-row-active">1,247</span>           │  │ <span class="tty-row-ready">0.42ms</span>        │  │ <span class="tty-row-complete">0</span>              │</div>
<div>│  │ CPU clock cycles│  │ Total runtime   │  │ Success         │</div>
<div>│  └─────────────────┘  └─────────────────┘  └─────────────────┘</div>
<div>│</div>
<div>│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐</div>
<div>│  │ CYCLES          │  │ EXECUTION TIME  │  │ EXIT CODE       │</div>
<div>│  │ 3,892           │  │ 1.85ms          │  │ <span class="tty-row-ready">139</span>            │</div>
<div>│  │ CPU clock cycles│  │ Total runtime   │  │ <span class="tty-row-ready">SIGSEGV (segfault)</span> │</div>
<div>│  └─────────────────┘  └─────────────────┘  └─────────────────┘</div>
<div>│</div>
<div>│  [R] Reset metrics | [S] Save report | [E] Export CSV</div>
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
