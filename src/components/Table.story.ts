import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Table.story.ts — таблицы результатов и лидербордов
 * operator: CRT-таблица с glow-border
 * tty: ASCII-таблица с box-drawing
 */
const story: HistoireVanillaStory = {
  title: "Table",
  icon: "carbon:table",
  variants: [
    {
      id: "operator-table",
      title: "Operator Table (Leaderboard)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-panel" style="max-width: 720px;">
              <div class="operator-panel-header">
                <span>LEADERBOARD_MODULE_M1</span>
                <span>TOTAL: 127</span>
              </div>
              <div style="padding: 0;">
                <div style="display: grid; grid-template-columns: 48px 180px 140px 140px 100px; border-bottom: 1px solid var(--line-primary);">
                  <div style="padding: 14px 12px; font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); font-weight: 600;">RANK</div>
                  <div style="padding: 14px 12px; font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); font-weight: 600;">OPERATOR</div>
                  <div style="padding: 14px 12px; font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); font-weight: 600;">COMPLETED</div>
                  <div style="padding: 14px 12px; font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); font-weight: 600;">BEST_TIME</div>
                  <div style="padding: 14px 12px; font-size: 10px; letter-spacing: var(--ls-ultra); color: var(--ink-muted); font-weight: 600;">SCORE</div>
                </div>

                <div style="display: grid; grid-template-columns: 48px 180px 140px 140px 100px; border-bottom: 1px solid var(--line-faint); background: var(--status-active-bg);">
                  <div style="padding: 14px 12px; color: var(--acc-bright); font-weight: 600;">#1</div>
                  <div style="padding: 14px 12px; color: var(--ink-primary);">@neo_architect</div>
                  <div style="padding: 14px 12px; color: var(--acc-primary);">8/8</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">1h 42m</div>
                  <div style="padding: 14px 12px; color: var(--acc-bright); font-weight: 600;">9840</div>
                </div>

                <div style="display: grid; grid-template-columns: 48px 180px 140px 140px 100px; border-bottom: 1px solid var(--line-faint); background: var(--bg-dark);">
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">#2</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">@byte_runner</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">8/8</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">2h 15m</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">9120</div>
                </div>

                <div style="display: grid; grid-template-columns: 48px 180px 140px 140px 100px; border-bottom: 1px solid var(--line-faint); background: var(--bg-dark);">
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">#3</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">@stack_master</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">8/8</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">2h 48m</div>
                  <div style="padding: 14px 12px; color: var(--ink-secondary);">8760</div>
                </div>

                <div style="display: grid; grid-template-columns: 48px 180px 140px 140px 100px; background: var(--bg-dark);">
                  <div style="padding: 14px 12px; color: var(--ink-dim);">#4</div>
                  <div style="padding: 14px 12px; color: var(--ink-dim);">@opcode_ninja</div>
                  <div style="padding: 14px 12px; color: var(--ink-dim);">7/8</div>
                  <div style="padding: 14px 12px; color: var(--ink-dim);">3h 12m</div>
                  <div style="padding: 14px 12px; color: var(--ink-dim);">8340</div>
                </div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-table",
      title: "TTY Table (Box Drawing)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 740px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[LEADERBOARD_MODULE_M1]────────────────────────────────────────────────────────┐</div>
<div>│  RANK │ OPERATOR        │ COMPLETED │ BEST_TIME │ SCORE │</div>
<div>├──────┼─────────────────┼───────────┼───────────┼───────┤</div>
<div>│  <span class="tty-row-active">#1</span>   │ @neo_architect  │ <span class="tty-row-complete">8/8</span>      │ 1h 42m    │ 9840  │</div>
<div>│  #2   │ @byte_runner    │ 8/8       │ 2h 15m    │ 9120  │</div>
<div>│  #3   │ @stack_master   │ 8/8       │ 2h 48m    │ 8760  │</div>
<div>│  #4   │ @opcode_ninja   │ 7/8       │ 3h 12m    │ 8340  │</div>
<div>├──────┴─────────────────┴───────────┴───────────┴───────┤</div>
<div>│  TOTAL: 127 operators                                              │</div>
<div class="tty-border-bottom">└────────────────────────────────────────────────────────────────────┘</div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
