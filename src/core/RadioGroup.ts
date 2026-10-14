import { h, uid, emit } from "./dom";

/**
 * RadioGroup — headless-ядро группы радио-кнопок.
 * A11y: role=radiogroup, нативные скрытые input[type=radio] (стрелки работают
 * из коробки), aria-checked дублируется классом для скинов.
 */
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface RadioGroupProps {
  name?: string;
  options: RadioOption[];
  value?: string;
  label?: string;
  onChange?: (value: string) => void;
}

export interface RadioGroupApi {
  el: HTMLElement;
  getValue: () => string;
  setValue: (v: string) => void;
  destroy: () => void;
}

export function createRadioGroup(props: RadioGroupProps): RadioGroupApi {
  const p = { ...props };
  const name = p.name ?? uid("radio");
  const el = h("div", "ui-radiogroup");
  el.setAttribute("role", "radiogroup");
  if (p.label) el.setAttribute("aria-label", p.label);

  const rows: { input: HTMLInputElement; opt: RadioOption }[] = [];
  for (const opt of p.options) {
    const id = uid("radio");
    const row = h("label", "ui-radiogroup__row");
    const input = h("input", "ui-radiogroup__input");
    input.id = id;
    input.type = "radio";
    input.name = name;
    input.value = opt.value;
    if (p.value === opt.value) input.checked = true;
    if (opt.disabled) input.disabled = true;
    const dot = h("span", "ui-radiogroup__dot", { "aria-hidden": "true" });
    const lbl = h("span", "ui-radiogroup__label");
    lbl.textContent = opt.label;
    row.append(input, dot, lbl);
    if (opt.description) {
      const desc = h("span", "ui-radiogroup__desc");
      desc.textContent = opt.description;
      row.appendChild(desc);
    }
    rows.push({ input, opt });
    el.appendChild(row);
  }

  function apply() {
    for (const r of rows) {
      r.input.setAttribute("aria-checked", String(r.input.checked));
      r.input.parentElement?.classList.toggle("ui-radiogroup__row--checked", r.input.checked);
    }
  }
  apply();

  const onChange = () => {
    const checked = rows.find((r) => r.input.checked);
    if (checked) {
      p.value = checked.opt.value;
      p.onChange?.(p.value);
      emit(el, "ui:change", { value: p.value });
    }
    apply();
  };
  el.addEventListener("change", onChange);

  // Нативные radio в одной name-группе уже умеют ArrowUp/Down/Left/Right.
  return {
    el,
    getValue: () => rows.find((r) => r.input.checked)?.opt.value ?? "",
    setValue(v) {
      for (const r of rows) r.input.checked = r.opt.value === v;
      apply();
      p.value = v;
    },
    destroy() {
      el.removeEventListener("change", onChange);
    },
  };
}
