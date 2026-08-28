import { h, uid, emit } from "./dom";

/**
 * Slider — headless-ядро слайдера.
 * A11y: нативный input[type=range] с aria-labelledby.
 */
export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  label?: string;
  /** Показывать текущее значение. */
  showValue?: boolean;
  onChange?: (value: number) => void;
}

export interface SliderApi {
  el: HTMLElement;
  input: HTMLInputElement;
  getValue: () => number;
  setValue: (v: number) => void;
  destroy: () => void;
}

export function createSlider(props: SliderProps): SliderApi {
  const p = { min: 0, max: 100, step: 1, value: 0, showValue: true, ...props };
  const id = uid("slider");
  const el = h("div", "ui-slider");
  const input = h("input", "ui-slider__input");
  input.id = id;
  input.type = "range";
  input.min = String(p.min);
  input.max = String(p.max);
  input.step = String(p.step);
  input.value = String(p.value);
  if (p.label) {
    const lbl = h("label", "ui-slider__label", { for: id });
    lbl.textContent = p.label;
    el.appendChild(lbl);
  }
  const pct = ((p.value - p.min) / (p.max - p.min)) * 100;
  const track = h("div", "ui-slider__track", { "aria-hidden": "true" });
  track.style.setProperty("--ui-slider-pct", `${pct}%`);
  const fill = h("div", "ui-slider__fill");
  track.appendChild(fill);
  el.append(input, track);
  let valueEl: HTMLElement | null = null;
  if (p.showValue) {
    valueEl = h("span", "ui-slider__value");
    valueEl.textContent = String(p.value);
    el.appendChild(valueEl);
  }

  function applyPct() {
    const pc = ((Number(input.value) - p.min) / (p.max - p.min)) * 100;
    track.style.setProperty("--ui-slider-pct", `${pc}%`);
    if (valueEl) valueEl.textContent = input.value;
  }

  const onInput = () => {
    applyPct();
    p.value = Number(input.value);
    p.onChange?.(p.value);
    emit(el, "ui:change", { value: p.value });
  };
  input.addEventListener("input", onInput);
  applyPct();

  return {
    el,
    input,
    getValue: () => Number(input.value),
    setValue(v) {
      input.value = String(v);
      p.value = v;
      applyPct();
    },
    destroy() {
      input.removeEventListener("input", onInput);
    },
  };
}
