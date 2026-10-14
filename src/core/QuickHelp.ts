import { h, emit } from "./dom";

/**
 * QuickHelp — headless-ядро компактной справки.
 * «с чего начать», горячие клавиши, глоссарий — секции с деталями.
 */
export interface HelpSection {
  id: string;
  title: string;
  /** Строки контента (или HTML-слоты через API). */
  lines?: string[];
}

export interface QuickHelpProps {
  sections: HelpSection[];
  title?: string;
}

export interface QuickHelpApi {
  el: HTMLElement;
  /** Добавить DOM-контент в секцию (вместо lines). */
  setSectionContent: (id: string, content: HTMLElement) => void;
}

export function createQuickHelp(props: QuickHelpProps): QuickHelpApi {
  const p = { title: "HELP", ...props };
  const el = h("section", "ui-quickhelp");
  const head = h("h3", "ui-quickhelp__title");
  head.textContent = p.title;
  el.appendChild(head);
  const containers = new Map<string, HTMLElement>();

  function apply() {
    containers.clear();
    const list = h("div", "ui-quickhelp__sections");
    for (const s of p.sections) {
      const box = h("section", "ui-quickhelp__section");
      const t = h("h4", "ui-quickhelp__section-title");
      t.textContent = s.title;
      box.appendChild(t);
      const body = h("div", "ui-quickhelp__section-body");
      for (const line of s.lines ?? []) {
        const l = h("div", "ui-quickhelp__line");
        l.textContent = line;
        body.appendChild(l);
      }
      box.appendChild(body);
      containers.set(s.id, body);
      list.appendChild(box);
    }
    el.appendChild(list);
  }
  apply();

  return {
    el,
    setSectionContent(id, content) {
      const body = containers.get(id);
      if (body) {
        body.innerHTML = "";
        body.appendChild(content);
        emit(el, "ui:change", { id });
      }
    },
  };
}
