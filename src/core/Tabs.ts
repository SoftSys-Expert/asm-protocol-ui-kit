import { h, uid, emit } from "./dom";

/**
 * Tabs — headless-ядро вкладок.
 * A11y: role=tablist/tab/tabpanel, aria-selected, aria-controls,
 * стрелочная навигация (Left/Right/Home/End), roving tabindex.
 */
export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  /** Контент панели (DOM). */
  content?: HTMLElement | null;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId?: string;
  onChange?: (id: string) => void;
}

export interface TabsApi {
  el: HTMLElement;
  select: (id: string) => void;
  activeId: () => string;
  panels: HTMLElement[];
  destroy: () => void;
}

export function createTabs(props: TabsProps): TabsApi {
  const p = { ...props };
  const listId = uid("tabs");
  const el = h("div", "ui-tabs");
  el.setAttribute("role", "tablist");
  el.setAttribute("aria-label", "tabs");

  const tabs: { btn: HTMLButtonElement; panel: HTMLElement; item: TabItem }[] = [];
  let active =
    p.tabs.find((t) => t.id === p.activeId && !t.disabled) ??
    p.tabs.find((t) => !t.disabled) ??
    p.tabs[0];

  for (const item of p.tabs) {
    const panelId = `${listId}-panel-${item.id}`;
    const btnId = `${listId}-tab-${item.id}`;
    const btn = h("button", "ui-tabs__tab");
    btn.type = "button";
    btn.id = btnId;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-controls", panelId);
    btn.textContent = item.label;
    if (item.disabled) {
      btn.setAttribute("aria-disabled", "true");
      btn.classList.add("ui-tabs__tab--disabled");
    }
    const panel = h("div", "ui-tabs__panel");
    panel.id = panelId;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", btnId);
    panel.tabIndex = 0;
    if (item.content) panel.appendChild(item.content);
    tabs.push({ btn, panel, item });
  }

  function render() {
    el.innerHTML = "";
    const bar = h("div", "ui-tabs__bar");
    for (const t of tabs) bar.appendChild(t.btn);
    el.appendChild(bar);
    for (const t of tabs) el.appendChild(t.panel);
    for (const t of tabs) {
      const selected = t.item.id === active?.id;
      t.btn.setAttribute("aria-selected", String(selected));
      t.btn.tabIndex = selected ? 0 : -1;
      t.btn.classList.toggle("ui-tabs__tab--active", selected);
      t.panel.classList.toggle("ui-tabs__panel--active", selected);
      if (!selected) t.panel.setAttribute("hidden", "");
      else t.panel.removeAttribute("hidden");
    }
  }
  render();

  const select = (id: string) => {
    const target = tabs.find((t) => t.item.id === id);
    if (!target || target.item.disabled) return;
    if (active?.id !== id) {
      active = target.item;
      render();
      p.onChange?.(id);
      emit(el, "ui:change", { id });
    }
  };

  const onClick = (e: Event) => {
    const btn = (e.target as Element).closest('[role="tab"]');
    if (btn) select(btn.id.replace(`${listId}-tab-`, ""));
  };
  const onKey = (e: KeyboardEvent) => {
    const btn = (e.target as Element).closest('[role="tab"]');
    if (!btn) return;
    const idx = tabs.findIndex((t) => t.btn === btn);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      // Перескок через disabled.
      let i = next;
      for (let guard = 0; guard < tabs.length && tabs[i].item.disabled; guard++) {
        i = e.key === "End" ? i - 1 : (i + 1) % tabs.length;
      }
      const t = tabs[i];
      if (!t.item.disabled) {
        select(t.item.id);
        t.btn.focus();
      }
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  return {
    el,
    select,
    activeId: () => active?.id ?? "",
    panels: tabs.map((t) => t.panel),
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}
