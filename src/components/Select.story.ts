import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Select.story.ts — выпадающий список выбора
 * operator: CRT-select с glow-border
 * tty: ASCII-выбор с квадратными скобками
 */
const story: HistoireVanillaStory = {
  title: "Select",
  icon: "carbon:dropdown",
  variants: [
    {
      id: "operator-select",
      title: "Operator Select Dropdown",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace; display: flex; flex-direction: column; gap: 20px;">
            <div>
              <div style="font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted); margin-bottom: 8px;">ARCHITECTURE</div>
              <select style="width: 280px; padding: 12px 16px; background: var(--bg-code); border: 1px solid var(--line-modal); border-radius: var(--radius-md); color: var(--acc-primary); font-size: 13px; font-family: var(--font-mono); letter-spacing: var(--ls-relaxed); cursor: pointer; outline: none;">
                <option value="x86-64" selected>x86-64 (64-bit)</option>
                <option value="x86-32">x86-32 (32-bit)</option>
                <option value="arm64">ARM64</option>
                <option value="riscv64">RISC-V 64-bit</option>
              </select>
            </div>

            <div>
              <div style="font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-muted); margin-bottom: 8px;">ASSEMBLER</div>
              <select style="width: 280px; padding: 12px 16px; background: var(--bg-code); border: 1px solid var(--line-modal); border-radius: var(--radius-md); color: var(--ink-secondary); font-size: 13px; font-family: var(--font-mono); letter-spacing: var(--ls-relaxed); cursor: pointer; outline: none;">
                <option value="nasm">NASM</option>
                <option value="gas">GAS (GNU Assembler)</option>
                <option value="fasm">FASM</option>
              </select>
            </div>

            <div style="opacity: 0.5;">
              <div style="font-size: 11px; letter-spacing: var(--ls-wider); color: var(--ink-ghost); margin-bottom: 8px;">LINKER</div>
              <select style="width: 280px; padding: 12px 16px; background: var(--bg-code); border: 1px solid var(--line-faint); border-radius: var(--radius-md); color: var(--ink-muted); font-size: 13px; font-family: var(--font-mono); letter-spacing: var(--ls-relaxed); cursor: not-allowed; outline: none;" disabled>
                <option value="ld">GNU ld</option>
              </select>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-select",
      title: "TTY Select (ASCII Menu)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 580px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[SELECT_TARGET]────────────────────────────────────────────────────────────┐</div>
<div>│</div>
<div>│  ARCHITECTURE:</div>
<div>│    <span class="tty-row-active">[x86-64 (64-bit)]</span></div>
<div>│    [x86-32 (32-bit)]</div>
<div>│    [ARM64]</div>
<div>│    [RISC-V 64-bit]</div>
<div>│</div>
<div>│  ASSEMBLER:</div>
<div>│    [NASM]</div>
<div>│    <span class="tty-row-ready">[GAS (GNU Assembler)]</span></div>
<div>│    [FASM]</div>
<div>│</div>
<div>│  LINKER:</div>
<div>│    <span class="tty-row-locked">[GNU ld] (locked)</span></div>
<div>│</div>
<div>│  Press [1-4] to select architecture</div>
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
