import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Tooltip.story.ts — всплывающие подсказки
 * operator: CRT-tooltip с glow-border
 * tty: ASCII-tooltip с box-drawing рамкой
 */
const story: HistoireVanillaStory = {
  title: "Tooltip",
  icon: "carbon:tooltip",
  variants: [
    {
      id: "operator-tooltip",
      title: "Operator Tooltip",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 20px;">
            <div style="position: relative; display: inline-block;">
              <button class="operator-btn-primary">RSP Register</button>
              <div style="position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); padding: 10px 14px; background: var(--panel-bg); border: 1px solid var(--acc-primary); border-radius: var(--radius-md); box-shadow: var(--glow-primary); z-index: 100;">
                <div style="font-size: 11px; letter-spacing: var(--ls-wider); color: var(--acc-primary); margin-bottom: 6px;">STACK POINTER</div>
                <div style="font-size: 12px; line-height: 1.5; color: var(--ink-medium);">Points to top of stack. Grows downward. Changed by PUSH, POP, RET.</div>
                <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 10px; height: 10px; background: var(--panel-bg); border-right: 1px solid var(--acc-primary); border-bottom: 1px solid var(--acc-primary);"></div>
              </div>
            </div>

            <div style="position: relative; display: inline-block;">
              <button class="operator-btn-secondary">SIGSEGV Handler</button>
              <div style="position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%); padding: 10px 14px; background: var(--panel-bg); border: 1px solid var(--fail-primary); border-radius: var(--radius-md); box-shadow: 0 0 20px rgb(244 119 119 / 20%); z-index: 100;">
                <div style="font-size: 11px; letter-spacing: var(--ls-wider); color: var(--fail-primary); margin-bottom: 6px;">SEGMENTATION FAULT</div>
                <div style="font-size: 12px; line-height: 1.5; color: var(--ink-medium);">Invalid memory access. Check your pointer offsets and array bounds.</div>
                <div style="position: absolute; top: -6px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 10px; height: 10px; background: var(--panel-bg); border-top: 1px solid var(--fail-primary); border-left: 1px solid var(--fail-primary);"></div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-tooltip",
      title: "TTY Tooltip (Box Drawing)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 600px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[CODE_EDITOR]──────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  mov rax, 1 <span class="tty-row-ready">│ [SYSCALL WRITE]</span></div>
<div>│  mov rdi, 1 <span class="tty-row-active">│ [STDOUT]</span></div>
<div>│  mov rsi, msg <span class="tty-border-row">│ [MESSAGE POINTER]</span></div>
<div>│               ┌────────────────────────────────────┐</div>
<div>│               │ Points to .data section buffer    │</div>
<div>│               │ Offset: 0x6010                    │</div>
<div>│               │ Length: 12 bytes                  │</div>
<div>│               └────────────────────────────────────┘</div>
<div>│  mov rdx, 13 <span class="tty-border-row">│ [BUFFER SIZE]</span></div>
<div>│</div>
<div>│  sys_write  <span class="tty-border-row">│ [SYSTEM CALL 1]</span></div>
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
