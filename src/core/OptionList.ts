import { h, uid, emit } from "./dom";

/**
 * OptionList — headless-ядро списка вариантов (choose-упражнение).
 * A11y: role=listbox/option, aria-selected, стрелки, множественный режим.
 */
export interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface OptionListProps {
  options: OptionItem[];
  /** Выбранные значения (для multi). */
  selected?: string[];
  multiple?: boolean;
  label?: string;
  onChange?: (selected: string[]) => void;
}

export interface OptionListApi {
  el: HTMLElement;
  getSelected: () => string[];
  setSelected: (values: string[]) => void;
  destroy: () => void;
}

export function createOptionList(props: OptionListProps): OptionListApi {
  const p = { selected: [] as string[], ...props };
  const id = uid("optionlist");
  const el = h("div", "ui-optionlist", { role: "listbox" });
  el.id = id;
  if (p.label) el.setAttribute("aria-label", p.label);
  if (p.multiple) el.setAttribute("aria-multiselectable", "true");

  const items: { div: HTMLElement; opt: OptionItem }[] = [];
  for (const opt of p.options) {
    const div = h("div", "ui-optionlist__option", {
      role: "option",
      tabindex: opt.disabled ? "-1" : "0",
      "aria-selected": "false",
    });
    div.dataset.value = opt.value;
    if (opt.disabled) {
      div.setAttribute("aria-disabled", "true");
      div.classList.add("ui-optionlist__option--disabled");
    }
    const marker = h("span", "ui-optionlist__marker", { "aria-hidden": "true" });
    marker.textContent = p.multiple ? "[ ]" : "( )";
    const label = h("span", "ui-optionlist__label");
    label.textContent = opt.label;
    div.append(marker, label);
    items.push({ div, opt });
    el.appendChild(div);
  }

  function apply() {
    for (const i of items) {
      const sel = p.selected.includes(i.opt.value);
      i.div.setAttribute("aria-selected", String(sel));
      i.div.classList.toggle("ui-optionlist__option--selected", sel);
      const m = i.div.querySelector(".ui-optionlist__marker");
      if (m) m.textContent = p.multiple ? (sel ? "[x]" : "[ ]") : sel ? "(x)" : "( )";
    }
  }
  apply();

  function pick(value: string) {
    const opt = items.find((i) => i.opt.value === value);
    if (!opt || opt.opt.disabled) return;
    if (p.multiple) {
      p.selected = p.selected.includes(value)
        ? p.selected.filter((v) => v !== value)
        : [...p.selected, value];
    } else {
      p.selected = p.selected.includes(value) ? [] : [value];
    }
    apply();
    p.onChange?.(p.selected);
    emit(el, "ui:change", { selected: p.selected });
  }

  const onClick = (e: Event) => {
    const div = (e.target as Element).closest('[role="option"]') as HTMLElement | null;
    if (div && el.contains(div)) pick(div.dataset.value ?? "");
  };
  const onKey = (e: KeyboardEvent) => {
    const div = (e.target as Element).closest('[role="option"]') as HTMLElement | null;
    if (!div || !el.contains(div)) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      pick(div.dataset.value ?? "");
      return;
    }
    const idx = items.findIndex((i) => i.div === div);
    let next = -1;
    if (e.key === "ArrowDown") next = idx + 1;
    else if (e.key === "ArrowUp") next = idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next >= 0 && next < items.length && !items[next].opt.disabled) {
      e.preventDefault();
      items[next].div.focus();
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  return {
    el,
    getSelected: () => [...p.selected],
    setSelected(values) {
      p.selected = [...values];
      apply();
    },
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}
