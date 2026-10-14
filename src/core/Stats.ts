import { h, emit } from "./dom";

/**
 * StatsGrid / Stats — headless-ядро плиток метрик.
 * A11y: dl-семантика (dt=метрика, dd=значение).
 */
export interface StatItem {
  id: string;
  label: string;
  value: string;
  /** Подпись под значением (динамика). */
  sub?: string;
  tone?: "neutral" | "accent" | "warn" | "fail";
}

export interface StatsProps {
  items: StatItem[];
  /** Колонок (скин может переопределить). */
  columns?: number;
}

export interface StatsApi {
  el: HTMLElement;
  setItems: (items: StatItem[]) => void;
}

export function createStats(props: StatsProps): StatsApi {
  const p = { columns: 4, ...props };
  const el = h("div", "ui-stats");
  el.dataset.columns = String(p.columns);

  function apply() {
    el.innerHTML = "";
    for (const item of p.items) {
      const tile = h("div", "ui-stats__tile");
      tile.dataset.tone = item.tone ?? "neutral";
      const dt = h("dt", "ui-stats__label");
      dt.textContent = item.label;
      const dd = h("dd", "ui-stats__value");
      dd.textContent = item.value;
      tile.append(dt, dd);
      if (item.sub) {
        const sub = h("div", "ui-stats__sub");
        sub.textContent = item.sub;
        tile.appendChild(sub);
      }
      el.appendChild(tile);
    }
  }
  apply();

  return {
    el,
    setItems: (items) => {
      p.items = items;
      apply();
      emit(el, "ui:change", {});
    },
  };
}
