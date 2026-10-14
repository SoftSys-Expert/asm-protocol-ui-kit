import { h } from "./dom";

/**
 * CodeBlock — headless-ядро блока кода.
 * Поведение: строки, опциональная нумерация, язык (для будущего хайлайта),
 * копирование в буфер.
 * A11y: <pre><code>, кнопка Copy с aria-label.
 */
export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  /** Кнопка копирования. */
  copyable?: boolean;
  caption?: string;
}

export interface CodeBlockApi {
  el: HTMLElement;
  setCode: (code: string) => void;
  destroy: () => void;
}

export function createCodeBlock(props: CodeBlockProps): CodeBlockApi {
  const p = { showLineNumbers: false, copyable: true, ...props };
  const el = h("div", "ui-codeblock");

  function apply() {
    el.innerHTML = "";
    if (p.caption || p.copyable) {
      const head = h("div", "ui-codeblock__head");
      if (p.caption) {
        const cap = h("span", "ui-codeblock__caption");
        cap.textContent = p.caption;
        head.appendChild(cap);
      }
      if (p.language) {
        const lang = h("span", "ui-codeblock__lang");
        lang.textContent = p.language;
        head.appendChild(lang);
      }
      head.appendChild(h("span", "ui-codeblock__spacer"));
      if (p.copyable) {
        const btn = h("button", "ui-codeblock__copy", { "aria-label": "Copy code" });
        btn.type = "button";
        btn.textContent = "copy";
        btn.addEventListener("click", onCopy);
        head.appendChild(btn);
      }
      el.appendChild(head);
    }
    const wrapper = h("div", "ui-codeblock__body");
    if (p.showLineNumbers) wrapper.classList.add("ui-codeblock__body--numbers");
    const lines = p.code.split("\n");
    const gutter = h("div", "ui-codeblock__gutter", { "aria-hidden": "true" });
    const pre = h("pre", "ui-codeblock__pre");
    const code = h("code", "ui-codeblock__code");
    if (p.language) code.dataset.language = p.language;
    for (let i = 0; i < lines.length; i++) {
      if (p.showLineNumbers) {
        const n = h("span", "ui-codeblock__ln");
        n.textContent = String(i + 1);
        gutter.appendChild(n);
      }
      const line = h("span", "ui-codeblock__line");
      line.textContent = lines[i];
      code.appendChild(line);
      if (i < lines.length - 1) code.appendChild(document.createTextNode("\n"));
    }
    pre.appendChild(code);
    if (p.showLineNumbers) wrapper.append(gutter, pre);
    else wrapper.appendChild(pre);
    el.appendChild(wrapper);
  }

  function onCopy(e: Event) {
    const btn = e.target as HTMLElement;
    void navigator.clipboard?.writeText(p.code).then(() => {
      btn.textContent = "copied";
      setTimeout(() => (btn.textContent = "copy"), 1500);
    });
  }

  apply();

  return {
    el,
    setCode(code) {
      p.code = code;
      apply();
    },
    destroy() {
      /* листенеры уезжают вместе с innerHTML="" */
    },
  };
}
