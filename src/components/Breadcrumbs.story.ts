import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Breadcrumbs.story.ts — навигация по структуре трека
 * operator: CRT-breadcrumbs с glow-разделителями
 * tty: ASCII-breadcrumbs с символами >
 */
const story: HistoireVanillaStory = {
  title: "Breadcrumbs",
  icon: "carbon:breadcrumb",
  variants: [
    {
      id: "operator-breadcrumbs",
      title: "Operator Breadcrumbs",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: var(--ls-wider);">
              <span style="color: var(--ink-dim); cursor: pointer;">TRACK</span>
              <span style="color: var(--line-faint);">/</span>
              <span style="color: var(--ink-dim); cursor: pointer;">M1_REGISTERS</span>
              <span style="color: var(--line-faint);">/</span>
              <span style="color: var(--ink-dim); cursor: pointer;">L04_STACK_OPS</span>
              <span style="color: var(--line-faint);">/</span>
              <span style="color: var(--acc-primary);">CHECK_02</span>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: var(--ls-wider);">
              <span style="color: var(--ink-dim); cursor: pointer;">TRACK</span>
              <span style="color: var(--line-faint);">/</span>
              <span style="color: var(--ink-dim); cursor: pointer;">M2_MEMORY</span>
              <span style="color: var(--line-faint);">/</span>
              <span style="color: var(--acc-primary);">L01_ADDRESSING</span>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: var(--ls-wider); opacity: 0.5;">
              <span style="color: var(--ink-ghost); cursor: not-allowed;">TRACK</span>
              <span style="color: var(--line-faint);">/</span>
              <span style="color: var(--ink-ghost); cursor: not-allowed;">M3_STACK</span>
              <span style="color: var(--line-faint);">/</span>
              <span style="color: var(--ink-ghost); cursor: not-allowed;">[LOCKED]</span>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-breadcrumbs",
      title: "TTY Breadcrumbs (ASCII Path)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 680px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[NAVIGATION]──────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  <span class="tty-row-ready">TRACK</span> > <span class="tty-row-ready">M1_REGISTERS</span> > <span class="tty-row-ready">L04_STACK_OPS</span> > <span class="tty-row-active">CHECK_02</span></div>
<div>│</div>
<div>│  <span class="tty-row-ready">TRACK</span> > <span class="tty-row-ready">M2_MEMORY</span> > <span class="tty-row-active">L01_ADDRESSING</span></div>
<div>│</div>
<div>│  <span class="tty-row-locked">TRACK</span> > <span class="tty-row-locked">M3_STACK</span> > <span class="tty-row-locked">[LOCKED]</span></div>
<div>│</div>
<div>│  [T] Track | [M] Modules | [L] Lessons | [H] Home</div>
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
