import { h, emit } from "./dom";

/**
 * TrackMap — headless-ядро карты трека.
 * Узлы-модули со статусами; связи рисует скин (линии/пунктир).
 * Каркас: последовательность узлов + статусы + текущий.
 */
export type TrackNodeState = "passed" | "current" | "locked" | "available";

export interface TrackNode {
  id: string;
  label: string;
  state?: TrackNodeState;
}

export interface TrackMapProps {
  nodes: TrackNode[];
  onSelect?: (id: string) => void;
}

export interface TrackMapApi {
  el: HTMLElement;
  setState: (id: string, state: TrackNodeState) => void;
  destroy: () => void;
}

export function createTrackMap(props: TrackMapProps): TrackMapApi {
  const p = { ...props };
  const el = h("div", "ui-trackmap", { role: "list", "aria-label": "Track map" });

  function apply() {
    el.innerHTML = "";
    p.nodes.forEach((node, i) => {
      const item = h("div", "ui-trackmap__item", { role: "listitem" });
      item.dataset.state = node.state ?? "available";
      item.dataset.index = String(i);
      item.tabIndex = node.state === "locked" ? -1 : 0;
      if (node.state === "locked") item.setAttribute("aria-disabled", "true");
      const dot = h("span", "ui-trackmap__dot", { "aria-hidden": "true" });
      dot.dataset.state = node.state ?? "available";
      const label = h("span", "ui-trackmap__label");
      label.textContent = node.label;
      item.append(dot, label);
      if (i < p.nodes.length - 1) {
        const link = h("span", "ui-trackmap__link", { "aria-hidden": "true" });
        link.dataset.state = node.state ?? "available";
        item.appendChild(link);
      }
      el.appendChild(item);
    });
  }
  apply();

  const onClick = (e: Event) => {
    const item = (e.target as Element).closest(".ui-trackmap__item") as HTMLElement | null;
    if (!item || item.dataset.state === "locked") return;
    const idx = Number(item.dataset.index);
    const node = p.nodes[idx];
    if (node) {
      p.onSelect?.(node.id);
      emit(el, "ui:select", { id: node.id });
    }
  };
  const onKey = (e: KeyboardEvent) => {
    const item = (e.target as Element).closest(".ui-trackmap__item") as HTMLElement | null;
    if (!item) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      item.click();
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  return {
    el,
    setState(id, state) {
      const node = p.nodes.find((n) => n.id === id);
      if (node) {
        node.state = state;
        apply();
        emit(el, "ui:change", { id, state });
      }
    },
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}
