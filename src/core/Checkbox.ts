import { h, uid, emit } from "./dom";

/**
 * Checkbox — headless-ядро флажка.
 * A11y: нативный input[type=checkbox] (скрыт визуально), label связан by id.
 */
export interface CheckboxProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  /** Описание под лейблом. */
  description?: string;
  onChange?: (checked: boolean) => void;
}

export interface CheckboxApi {
  el: HTMLElement;
  input: HTMLInputElement;
  isChecked: () => boolean;
  toggle: () => void;
  setChecked: (v: boolean) => void;
  destroy: () => void;
}

export function createCheckbox(props: CheckboxProps): CheckboxApi {
  const p = { checked: false, ...props };
  const id = uid("checkbox");
  const el = h("label", "ui-checkbox");
  const input = h("input", "ui-checkbox__input");
  input.id = id;
  input.type = "checkbox";
  input.checked = p.checked;
  if (p.disabled) input.disabled = true;
  const box = h("span", "ui-checkbox__box", { "aria-hidden": "true" });
  const lbl = h("span", "ui-checkbox__label");
  lbl.textContent = p.label;
  el.append(input, box, lbl);
  if (p.description) {
    const desc = h("span", "ui-checkbox__desc");
    desc.textContent = p.description;
    input.setAttribute("aria-describedby", `${id}-desc`);
    desc.id = `${id}-desc`;
    el.appendChild(desc);
  }

  const onChange = () => {
    p.checked = input.checked;
    el.classList.toggle("ui-checkbox--checked", p.checked);
    props.onChange?.(p.checked);
    emit(el, "ui:change", { checked: p.checked });
  };
  input.checked = p.checked;
  input.addEventListener("change", onChange);
  el.classList.toggle("ui-checkbox--checked", p.checked);

  return {
    el,
    input,
    isChecked: () => input.checked,
    toggle: () => input.click(),
    setChecked(v) {
      input.checked = v;
      onChange();
    },
    destroy() {
      input.removeEventListener("change", onChange);
    },
  };
}
