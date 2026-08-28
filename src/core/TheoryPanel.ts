import { h } from "./dom";
import type { PanelApi } from "./Panel";

/**
 * TheoryPanel — headless-ядро панели теории.
 * Композиция: Panel + типографические блоки (p, term, code).
 * Слоты контента: p(), term(), code() создают DOM-элементы.
 */
export interface TheoryPanelProps {
  title?: string;
}

export interface TheoryPanelApi {
  el: HTMLElement;
  body: HTMLElement;
  /** Абзац. */
  p: (text: string) => HTMLElement;
  /** Термин с underline-dotted. */
  term: (text: string, definition?: string) => HTMLElement;
  /** Инлайн-код. */
  code: (text: string) => HTMLElement;
  /** Блок кода. */
  codeBlock: (code: string, language?: string) => HTMLElement;
  destroy: () => void;
}

export function createTheoryPanel(props: TheoryPanelProps, panel?: PanelApi): TheoryPanelApi {
  const host = panel ?? createPanelHost(props.title);
  const body = host.body;

  const p = (text: string) => {
    const el = h("p", "ui-theory__p");
    el.textContent = text;
    body.appendChild(el);
    return el;
  };
  const term = (text: string, definition?: string) => {
    const el = h("span", "ui-theory__term");
    el.textContent = text;
    if (definition) {
      el.setAttribute("title", definition);
      el.setAttribute("aria-label", `${text}: ${definition}`);
    }
    return el;
  };
  const code = (text: string) => {
    const el = h("code", "ui-theory__code");
    el.textContent = text;
    return el;
  };
  const codeBlock = (codeText: string, language?: string) => {
    const el = h("pre", "ui-theory__codeblock");
    if (language) el.dataset.language = language;
    el.textContent = codeText;
    body.appendChild(el);
    return el;
  };

  return {
    el: host.el,
    body,
    p,
    term,
    code,
    codeBlock,
    destroy: host.destroy,
  };
}

import { createPanel } from "./Panel";
function createPanelHost(title?: string): PanelApi {
  return createPanel({ title: title ?? "THEORY" });
}
