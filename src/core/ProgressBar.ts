import { h, emit } from "./dom";

/**
 * ProgressBar — headless-ядро линейного прогресса.
 * A11y: role=progressbar + aria-valuenow/min/max (или indeterminate).
 */
export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  /** Показывать числовой % справа. */
  showValue?: boolean;
  onChange?: never;
}

export interface ProgressBarApi {
  el: HTMLElement;
  setValue: (v: number) => void;
  getValue: () => number;
  destroy: () => void;
}

export function createProgressBar(props: ProgressBarProps): ProgressBarApi {
  const p = { max: 100, showValue: true, ...props };
  const el = h("div", "ui-progress");
  if (p.label) el.setAttribute("aria-label", p.label);
  const track = h("div", "ui-progress__track", { role: "progressbar" });
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(p.max));
  const fill = h("div", "ui-progress__fill");
  track.appendChild(fill);
  el.appendChild(track);
  let valueEl: HTMLElement | null = null;
  if (p.showValue) {
    valueEl = h("span", "ui-progress__value");
    el.appendChild(valueEl);
  }

  function apply() {
    const v = Math.max(0, Math.min(p.value, p.max));
    const pct = p.max === 0 ? 0 : Math.round((v / p.max) * 100);
    fill.style.width = `${pct}%`;
    track.setAttribute("aria-valuenow", String(v));
    track.setAttribute("aria-valuetext", `${pct}%`);
    if (valueEl) valueEl.textContent = `${pct}%`;
    el.classList.toggle("ui-progress--complete", v >= p.max && p.max > 0);
  }
  apply();

  return {
    el,
    setValue(v) {
      p.value = v;
      apply();
      emit(el, "ui:change", { value: v });
    },
    getValue: () => p.value,
    destroy() {
      /* нет листенеров */
    },
  };
}
