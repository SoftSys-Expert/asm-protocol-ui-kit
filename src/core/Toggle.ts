import { h, emit } from "./dom";

/**
 * Toggle — headless-ядро переключателя вкл/выкл.
 * A11y: role=switch + aria-checked, Space переключает.
 */
export interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  /** Показать лейбл слева (для форм). */
  showLabel?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface ToggleApi {
  el: HTMLElement;
  isChecked: () => boolean;
  setChecked: (v: boolean) => void;
  toggle: () => void;
  destroy: () => void;
}

export function createToggle(props: ToggleProps): ToggleApi {
  const p = { checked: false, showLabel: true, ...props };
  const el = h("button", "ui-toggle", {
    role: "switch",
    "aria-checked": String(p.checked),
  });
  el.type = "button";
  if (p.label) el.setAttribute("aria-label", p.label);
  const track = h("span", "ui-toggle__track", { "aria-hidden": "true" });
  const thumb = h("span", "ui-toggle__thumb", { "aria-hidden": "true" });
  track.appendChild(thumb);
  el.appendChild(track);
  let labelEl: HTMLElement | null = null;
  if (p.showLabel && p.label) {
    labelEl = h("span", "ui-toggle__label");
    labelEl.textContent = p.label;
    el.appendChild(labelEl);
  }

  function apply() {
    el.setAttribute("aria-checked", String(p.checked));
    el.classList.toggle("ui-toggle--on", p.checked);
    if (p.disabled) el.setAttribute("disabled", "");
    else el.removeAttribute("disabled");
  }
  apply();

  const onClick = () => {
    if (p.disabled) return;
    p.checked = !p.checked;
    apply();
    p.onChange?.(p.checked);
    emit(el, "ui:change", { checked: p.checked });
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onClick();
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  return {
    el,
    isChecked: () => p.checked,
    setChecked(v) {
      p.checked = v;
      apply();
    },
    toggle: onClick,
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}
