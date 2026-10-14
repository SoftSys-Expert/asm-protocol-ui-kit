import { h, emit } from "./dom";

/**
 * Breadcrumbs — headless-ядро хлебных крошек.
 * A11y: nav + aria-label, последний сегмент — aria-current=page.
 */
export interface Crumb {
  id: string;
  label: string;
  /** Кликабельный ли сегмент. */
  clickable?: boolean;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  separator?: string;
  onNavigate?: (id: string) => void;
}

export interface BreadcrumbsApi {
  el: HTMLElement;
  setItems: (items: Crumb[]) => void;
  destroy: () => void;
}

export function createBreadcrumbs(props: BreadcrumbsProps): BreadcrumbsApi {
  const p = { separator: "/", ...props };
  const el = h("nav", "ui-breadcrumbs", { "aria-label": "Breadcrumb" });

  function render() {
    el.innerHTML = "";
    const ol = h("ol", "ui-breadcrumbs__list");
    p.items.forEach((item, i) => {
      const li = h("li", "ui-breadcrumbs__item");
      const last = i === p.items.length - 1;
      if (last) {
        const cur = h("span", "ui-breadcrumbs__current", { "aria-current": "page" });
        cur.textContent = item.label;
        li.appendChild(cur);
      } else {
        const a = h("button", "ui-breadcrumbs__link");
        a.type = "button";
        a.textContent = item.label;
        if (item.clickable === false) {
          a.setAttribute("disabled", "");
          a.classList.add("ui-breadcrumbs__link--static");
        }
        a.dataset.id = item.id;
        li.appendChild(a);
        const sep = h("span", "ui-breadcrumbs__sep", { "aria-hidden": "true" });
        sep.textContent = p.separator;
        li.appendChild(sep);
      }
      ol.appendChild(li);
    });
    el.appendChild(ol);
  }
  render();

  const onClick = (e: Event) => {
    const a = (e.target as Element).closest(".ui-breadcrumbs__link") as HTMLElement | null;
    if (a && !a.hasAttribute("disabled")) {
      const id = a.dataset.id ?? "";
      p.onNavigate?.(id);
      emit(el, "ui:navigate", { id });
    }
  };
  el.addEventListener("click", onClick);

  return {
    el,
    setItems(items) {
      p.items = items;
      render();
    },
    destroy() {
      el.removeEventListener("click", onClick);
    },
  };
}
