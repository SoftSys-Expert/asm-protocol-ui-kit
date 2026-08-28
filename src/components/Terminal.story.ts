import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Terminal.story.ts — терминальный вывод с логами и курсором
 * operator: CRT-панель с glow и scanlines
 * tty: ASCII-рамка с box-drawing
 */
const story: HistoireVanillaStory = {
  title: "Terminal",
  icon: "carbon:terminal",
  variants: [
    {
      id: "operator-terminal",
      title: "Operator Terminal",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09; font-family: 'IBM Plex Mono', monospace;">
            <div class="operator-panel" style="max-width: 640px; height: 380px;">
              <div class="operator-panel-header">
                <span>TERMINAL_OUTPUT</span>
                <span>ASM_PROTOCOL_V1.2</span>
              </div>
              <div class="operator-panel-content" style="padding: 16px; font-size: 12px; line-height: 1.7;">
                <div style="color: var(--ink-faded); margin-bottom: 12px;">$ nasm -f elf64 src/main.asm</div>
                <div style="color: var(--ink-secondary); margin-bottom: 8px;">[OK] Section .data assembled</div>
                <div style="color: var(--ink-secondary); margin-bottom: 8px;">[OK] Section .text assembled</div>
                <div style="color: var(--acc-primary); margin-bottom: 12px;">[SUCCESS] Binary built: main.o</div>
                <div style="color: var(--ink-faded); margin-bottom: 8px;">$ ld -o main main.o</div>
                <div style="color: var(--ink-secondary); margin-bottom: 12px;">[OK] Linking complete</div>
                <div style="color: var(--ink-faded); margin-bottom: 12px;">$ ./main</div>
                <div style="color: var(--acc-bright); margin-bottom: 12px;">hello, asm</div>
                <div style="color: var(--ink-faded); margin-bottom: 8px;">$ echo "Exit code: $?"</div>
                <div style="color: var(--info-primary); margin-bottom: 8px;">Exit code: 0</div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 16px;">
                  <span style="color: var(--acc-primary);">operator@asm:~$</span>
                  <span style="color: var(--acc-primary); animation: blink 1s steps(1) infinite;">█</span>
                </div>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-terminal",
      title: "TTY Terminal (Box Drawing)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 680px; height: 400px;">
            <div class="tty-panel-content">
<div class="tty-border-top">┌─[TERMINAL_OUTPUT]─────────────────────────────────────────────────────────────┐</div>
<div>│  $ nasm -f elf64 src/main.asm</div>
<div>│  [OK] Section .data assembled</div>
<div>│  [OK] Section .text assembled</div>
<div>│  [SUCCESS] Binary built: main.o</div>
<div>│</div>
<div>│  $ ld -o main main.o</div>
<div>│  [OK] Linking complete</div>
<div>│</div>
<div>│  $ ./main</div>
<div class="tty-row-active">│  hello, asm</div>
<div>│</div>
<div>│  $ echo "Exit code: $?"</div>
<div class="tty-row-ready">│  Exit code: 0</div>
<div>│</div>
<div>│  operator@asm:~$ █</div>
<div class="tty-border-bottom">└────────────────────────────────────────────────────────────────────────────────┘</div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
