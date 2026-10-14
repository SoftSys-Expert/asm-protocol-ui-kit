import { h, emit } from "./dom";

/**
 * Sidebar — headless-ядро дерева навигации (трек → модули → уроки).
 * A11y: role=tree/treeitem/group, aria-expanded, arrow-навигация.
 * Свёрнутое состояние — одна колонка (скин решает ширину).
 */
export type LessonDot = "passed" | "active" | "locked";

export interface SidebarLesson {
  id: string;
  label: string;
  dot?: LessonDot;
}

export interface SidebarModule {
  id: string;
  label: string;
  lessons: SidebarLesson[];
  expanded?: boolean;
}

export interface SidebarProps {
  title?: string;
  modules: SidebarModule[];
  collapsed?: boolean;
  onSelect?: (id: string) => void;
}

export interface SidebarApi {
  el: HTMLElement;
  toggle: () => void;
  isCollapsed: () => boolean;
  destroy: () => void;
}

export function createSidebar(props: SidebarProps): SidebarApi {
  const p = { collapsed: false, ...props };
  const el = h("nav", "ui-sidebar", { "aria-label": p.title ?? "Track navigation" });
  const head = h("div", "ui-sidebar__head");
  const title = h("span", "ui-sidebar__title");
  title.textContent = p.title ?? "TRACKS";
  const toggleBtn = h("button", "ui-sidebar__toggle", { "aria-label": "Toggle sidebar" });
  toggleBtn.type = "button";
  toggleBtn.textContent = "«";
  head.append(title, toggleBtn);
  const tree = h("ul", "ui-sidebar__tree", { role: "tree" });

  function renderTree() {
    tree.innerHTML = "";
    for (const mod of p.modules) {
      const modItem = h("li", "ui-sidebar__module", { role: "treeitem" });
      modItem.dataset.id = mod.id;
      modItem.setAttribute("aria-expanded", String(mod.expanded ?? false));
      const modBtn = h("button", "ui-sidebar__module-btn");
      modBtn.type = "button";
      modBtn.dataset.id = mod.id;
      modBtn.setAttribute("aria-expanded", String(mod.expanded ?? false));
      const caret = h("span", "ui-sidebar__caret", { "aria-hidden": "true" });
      caret.textContent = mod.expanded ? "▾" : "▸";
      const lbl = h("span", "ui-sidebar__module-label");
      lbl.textContent = mod.label;
      modBtn.append(caret, lbl);
      modItem.appendChild(modBtn);
      if (mod.expanded) {
        const group = h("ul", "ui-sidebar__group", { role: "group" });
        for (const lesson of mod.lessons) {
          const li = h("li", "ui-sidebar__lesson", { role: "treeitem" });
          li.dataset.id = lesson.id;
          const dot = h("span", "ui-sidebar__dot", { "aria-hidden": "true" });
          dot.dataset.dot = lesson.dot ?? "available";
          const l = h("span", "ui-sidebar__lesson-label");
          l.textContent = lesson.label;
          li.append(dot, l);
          li.tabIndex = 0;
          group.appendChild(li);
        }
        modItem.appendChild(group);
      }
      tree.appendChild(modItem);
    }
  }
  renderTree();
  el.append(head, tree);

  function apply() {
    el.classList.toggle("ui-sidebar--collapsed", p.collapsed);
    toggleBtn.textContent = p.collapsed ? "»" : "«";
    el.setAttribute("aria-collapsed", String(p.collapsed));
  }
  apply();

  const onClick = (e: Event) => {
    const t = e.target as Element;
    const modBtn = t.closest(".ui-sidebar__module-btn") as HTMLElement | null;
    if (modBtn) {
      const mod = p.modules.find((m) => m.id === modBtn.dataset.id);
      if (mod) {
        mod.expanded = !(mod.expanded ?? false);
        renderTree();
        apply();
        emit(el, "ui:toggle-module", { id: mod.id, expanded: mod.expanded });
      }
      return;
    }
    if (t.closest(".ui-sidebar__toggle")) {
      toggle();
      return;
    }
    const lesson = t.closest(".ui-sidebar__lesson") as HTMLElement | null;
    if (lesson) {
      const id = lesson.dataset.id ?? "";
      p.onSelect?.(id);
      emit(el, "ui:select", { id });
    }
  };
  el.addEventListener("click", onClick);

  function toggle() {
    p.collapsed = !p.collapsed;
    apply();
    emit(el, "ui:toggle", { collapsed: p.collapsed });
  }

  return {
    el,
    toggle,
    isCollapsed: () => p.collapsed,
    destroy() {
      el.removeEventListener("click", onClick);
    },
  };
}
