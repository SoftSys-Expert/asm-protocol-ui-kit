import { h, emit } from "./dom";

/**
 * ResourcePressure — headless-ядро баров ресурсного давления.
 * Такты / память / время; >80% — warn (класс, не блокировка).
 */
export interface ResourceBar {
  id: string;
  label: string;
  /** Использовано. */
  used: number;
  /** Лимит. */
  limit: number;
  /** Единица для aria-valuetext. */
  unit?: string;
}

export interface ResourcePressureProps {
  bars: ResourceBar[];
}

export interface ResourcePressureApi {
  el: HTMLElement;
  setBar: (id: string, used: number) => void;
}

export function createResourcePressure(props: ResourcePressureProps): ResourcePressureApi {
  const p = { ...props };
  const el = h("div", "ui-pressure");

  function pct(bar: ResourceBar): number {
    return bar.limit === 0 ? 0 : Math.min(100, Math.round((bar.used / bar.limit) * 100));
  }

  function apply() {
    el.innerHTML = "";
    for (const bar of p.bars) {
      const v = pct(bar);
      const row = h("div", "ui-pressure__row");
      const label = h("span", "ui-pressure__label");
      label.textContent = bar.label;
      const track = h("div", "ui-pressure__track", { role: "progressbar" });
      track.setAttribute("aria-label", bar.label);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(bar.limit));
      track.setAttribute("aria-valuenow", String(bar.used));
      track.setAttribute("aria-valuetext", `${v}%${bar.unit ? ` ${bar.unit}` : ""}`);
      const fill = h("div", "ui-pressure__fill");
      fill.style.width = `${v}%`;
      fill.dataset.level = v > 80 ? "warn" : v > 60 ? "mid" : "ok";
      track.appendChild(fill);
      const value = h("span", "ui-pressure__value");
      value.textContent = `${bar.used}/${bar.limit}${bar.unit ? ` ${bar.unit}` : ""}`;
      row.append(label, track, value);
      row.dataset.warn = v > 80 ? "true" : "false";
      el.appendChild(row);
    }
  }
  apply();

  return {
    el,
    setBar(id, used) {
      const bar = p.bars.find((b) => b.id === id);
      if (bar) {
        bar.used = used;
        apply();
        emit(el, "ui:change", { id, used });
      }
    },
  };
}
