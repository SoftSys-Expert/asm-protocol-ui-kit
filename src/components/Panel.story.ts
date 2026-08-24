import "../styles/skin-operator.css";
import "../styles/skin-tty.css";
import type { HistoireVanillaStory } from "../histoire.d";

/**
 * Panel.story.ts — Histoire vanilla story для компонента Panel
 */
const story: HistoireVanillaStory = {
  title: "Panel",
  icon: "carbon:panel-expansion",
  variants: [
    {
      id: "operator-panel",
      title: "Operator Panel",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div style="padding: 20px; background: #070A09;">
            <div class="operator-panel" style="max-width: 600px;">
              <div class="operator-panel-header">
                <span>MODULE M1 — REGISTERS</span>
                <span style="color: #72F2B0;">IN PROGRESS</span>
              </div>
              <div class="operator-panel-content">
                <h3 style="margin: 0 0 18px; font-family: 'IBM Plex Mono', monospace; font-size: 21px; font-weight: 500; color: #DDE8E3;">Trace EAX changes</h3>
                <p style="margin: 0 0 16px; font-size: 14.5px; line-height: 1.65; color: #93A29C;">
                  After the second mov, RAX holds only 7. Registers do not accumulate.
                </p>
              </div>
              <div class="operator-panel-footer">
                <span>SESSION 3 / 5</span>
                <span style="color: #68BDE7;">60% COMPLETE</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: "tty-panel",
      title: "TTY Panel (Box-Drawing Table)",
      onMount: ({ el }) => {
        el.innerHTML = `
          <div class="tty-panel" style="max-width: 1260px;">
            <div class="tty-panel-content">
<div style="color: #2C4A3C;">┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐</div>
<div style="color: #72F2B0;">│ ASM://PROTOCOL                                                tty1  ·  /map                                │</div>
<div style="color: #2C4A3C;">├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤</div>
<div style="color: #6E7E77;">│ TRACK       MODULE            PROGRESS      %     STATE         RESULT                                     │</div>
<div style="color: #2C4A3C;">├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤</div>
<div style="color: #4E8E72;">│ .prologue   m0  prologue      [##########]  100%  complete      reads a hex dump, names each byte          │</div>
<div style="color: #72F2B0;">│ .x86_64     m1  registers     [######----]  60%   CURRENT       traces EAX, explains zero-extension        │</div>
<div style="color: #9FD9F5;">│ .x86_64     m2  arithmetic    [----------]  0%    ready         predicts flags after add / sub             │</div>
<div style="color: #7A8A83;">│ .x86_64     m3  branches      [----------]  0%    locked m2     reads flags, predicts the jump             │</div>
<div style="color: #2C4A3C;">└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘</div>
            </div>
          </div>
        `;
      },
    },
  ],
};

export default story;
