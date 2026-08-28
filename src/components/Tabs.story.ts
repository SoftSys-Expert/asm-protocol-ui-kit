import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Tabs.story.ts — вкладки для навигации по секциям
 * operator: CRT-вкладки с glow при активном состоянии
 * tty: ASCII-вкладки с подчёркиванием
 */
const story: HistoireVanillaStory = {
  title: "Tabs",
  icon: "carbon:tab",
  variants: [
    {
      id: "operator-tabs",
      title: "Operator Tabs",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-panel" style="max-width: 680px;">
              <div class="operator-panel-header">
                <span>LESSON_VIEWER</span>
                <span>M1_L04_STACK_OPS</span>
              </div>
              <div style="border-bottom: 1px solid var(--line-primary); display: flex;">
                <button style="padding: 12px 20px; background: transparent; border: 0; border-bottom: 2px solid var(--acc-primary); color: var(--acc-primary); font: 500 11px/1 var(--font-mono); letter-spacing: var(--ls-wider); text-transform: uppercase; cursor: pointer;">Content</button>
                <button style="padding: 12px 20px; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--ink-dim); font: 500 11px/1 var(--font-mono); letter-spacing: var(--ls-wider); text-transform: uppercase; cursor: pointer;">Code</button>
                <button style="padding: 12px 20px; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--ink-dim); font: 500 11px/1 var(--font-mono); letter-spacing: var(--ls-wider); text-transform: uppercase; cursor: pointer;">Output</button>
                <button style="padding: 12px 20px; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--ink-dim); font: 500 11px/1 var(--font-mono); letter-spacing: var(--ls-wider); text-transform: uppercase; cursor: pointer;">References</button>
              </div>
              <div class="operator-panel-content">
                <div style="font-size: 14px; line-height: 1.6; color: var(--ink-medium);">
                  <p style="margin: 0 0 16px;">Stack operations in x86-64 assembly use PUSH and POP instructions to manipulate the call stack.</p>
                  <p style="margin: 0 0 16px;">The stack grows downward, with RSP pointing to the top of the stack.</p>
                  <p style="margin: 0; color: var(--acc-primary);">[Active tab: Content]</p>
                </div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-tabs",
      title: "TTY Tabs (Underline)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 700px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[LESSON_VIEWER]────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  <span class="tty-row-active">[CONTENT]</span> [CODE] [OUTPUT] [REFERENCES]</div>
<div>│  ────────────────────────────────────────────────────────────────────</div>
<div>│</div>
<div>│  Stack operations in x86-64 assembly use PUSH and POP instructions</div>
<div>│  to manipulate the call stack.</div>
<div>│</div>
<div>│  The stack grows downward, with RSP pointing to the top of the stack.</div>
<div>│</div>
<div>│  [Active tab: CONTENT]</div>
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
