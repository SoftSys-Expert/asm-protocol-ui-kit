import { h } from "./dom";

/**
 * Panel — headless-ядро панели: заголовок + контент-слот.
 * Поведение: опциональный header с meta, collapse (опционально).
 * A11y: header — заголовочный уровень через role, collapse — aria-expanded.
 */
export interface PanelProps {
  title?: string;
  /** Правый слот заголовка: статус, метрики. */
  meta?: string;
  /** Включить сворачивание по клику на заголовок. */
  collapsible?: boolean;
  collapsed?: boolean;
  /** Уровень заголовка для a11y (по умолчанию 2). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export interface PanelApi {
  el: HTMLElement;
  /** Контейнер для пользовательского контента. */
  body: HTMLElement;
  setCollapsed: (v: boolean) => void;
  isCollapsed: () => boolean;
  destroy: () => void;
}

export function createPanel(props: PanelProps): PanelApi {
  const p = { collapsible: false, collapsed: false, headingLevel: 2, ...props };
  const el = h("section", "ui-panel");
  const body = h("div", "ui-panel__body");

  const apply = () => {
    el.innerHTML = "";
    if (p.title !== undefined) {
      const header = h("div", "ui-panel__header");
      const titleTag = `h${p.headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
      const title = h(titleTag, "ui-panel__title");
      title.textContent = p.title;
      header.appendChild(title);
      if (p.meta !== undefined) {
        const meta = h("span", "ui-panel__meta");
        meta.textContent = p.meta;
        header.appendChild(meta);
      }
      if (p.collapsible) {
        header.classList.add("ui-panel__header--collapsible");
        header.setAttribute("role", "button");
        header.setAttribute("tabindex", "0");
        header.setAttribute("aria-expanded", String(!p.collapsed));
      }
      el.appendChild(header);
    }
    el.classList.toggle("ui-panel--collapsed", p.collapsed);
    if (p.collapsible) el.setAttribute("data-collapsible", "");
    else el.removeAttribute("data-collapsible");
    el.appendChild(body);
  };
  apply();

  const toggle = () => {
    if (!p.collapsible) return;
    p.collapsed = !p.collapsed;
    apply();
  };
  const onClick = (e: Event) => {
    const header = (e.target as Element).closest(".ui-panel__header--collapsible");
    if (header) toggle();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const header = (e.target as Element).closest(".ui-panel__header--collapsible");
    if (header) {
      e.preventDefault();
      toggle();
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  // При повторном apply() body пересоздаётся в DOM — сохраняем ссылку.
  const bodyRef = body;

  return {
    get el() {
      return el;
    },
    get body() {
      return bodyRef;
    },
    setCollapsed(v) {
      p.collapsed = v;
      apply();
    },
    isCollapsed: () => p.collapsed,
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}
