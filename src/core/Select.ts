import { h, uid, emit } from "./dom";

/**
 * Select — headless-ядро дропдауна (кастомного, с клавиатурной навигацией).
 * A11y: role=listbox/option, aria-expanded, aria-activedescendant,
 * ArrowUp/Down/Home/End, Enter/Space выбор, ESC закрыть, type-ahead.
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export interface SelectApi {
  el: HTMLElement;
  getValue: () => string;
  setValue: (v: string) => void;
  open: () => void;
  close: () => void;
  destroy: () => void;
}

export function createSelect(props: SelectProps): SelectProps extends never ? never : SelectApi {
  const p = { placeholder: "Select…", ...props };
  const id = uid("select");
  const el = h("div", "ui-select");
  const btn = h("button", "ui-select__btn", {
    role: "combobox",
    "aria-haspopup": "listbox",
    "aria-expanded": "false",
  });
  btn.type = "button";
  const btnLabel = h("span", "ui-select__value");
  const arrow = h("span", "ui-select__arrow", { "aria-hidden": "true" });
  arrow.textContent = "▾";
  btn.append(btnLabel, arrow);
  const list = h("ul", "ui-select__list", {
    role: "listbox",
    id: `${id}-list`,
    tabindex: "-1",
  });
  el.append(btn, list);

  const items: { li: HTMLLIElement; opt: SelectOption }[] = [];
  for (const opt of p.options) {
    const li = h("li", "ui-select__option", { role: "option" });
    li.id = `${id}-opt-${opt.value}`;
    li.textContent = opt.label;
    li.dataset.value = opt.value;
    if (opt.disabled) {
      li.setAttribute("aria-disabled", "true");
      li.classList.add("ui-select__option--disabled");
    }
    items.push({ li, opt });
    list.appendChild(li);
  }

  let value = p.value ?? "";
  let activeIdx = items.findIndex((i) => i.opt.value === value);
  let opened = false;
  let typeAheadBuf = "";
  let typeAheadTimer: ReturnType<typeof setTimeout> | undefined;

  function apply() {
    const sel = items.find((i) => i.opt.value === value);
    btnLabel.textContent = sel ? sel.opt.label : p.placeholder ?? "";
    btn.classList.toggle("ui-select__btn--placeholder", !sel);
    for (const i of items) {
      const selected = i.opt.value === value;
      i.li.setAttribute("aria-selected", String(selected));
      i.li.classList.toggle("ui-select__option--selected", selected);
    }
    el.classList.toggle("ui-select--open", opened);
    btn.setAttribute("aria-expanded", String(opened));
    if (opened) list.removeAttribute("hidden");
    else list.setAttribute("hidden", "");
    const act = items[activeIdx];
    if (act) btn.setAttribute("aria-activedescendant", act.li.id);
    else btn.removeAttribute("aria-activedescendant");
  }
  apply();

  function move(dir: 1 | -1) {
    let i = activeIdx;
    for (let guard = 0; guard < items.length; guard++) {
      i = (i + dir + items.length) % items.length;
      if (!items[i].opt.disabled) break;
    }
    activeIdx = i;
    items[activeIdx].li.scrollIntoView?.({ block: "nearest" });
    apply();
  }

  function choose(idx: number) {
    const it = items[idx];
    if (!it || it.opt.disabled) return;
    value = it.opt.value;
    activeIdx = idx;
    closeList();
    p.onChange?.(value);
    emit(el, "ui:change", { value });
  }

  function openList() {
    if (opened) return;
    opened = true;
    if (activeIdx < 0) activeIdx = Math.max(0, items.findIndex((i) => !i.opt.disabled));
    apply();
    emit(el, "ui:open", {});
  }
  function closeList() {
    if (!opened) return;
    opened = false;
    apply();
    emit(el, "ui:close", {});
  }

  const onBtnKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const wasOpen = opened;
      if (!opened) openList();
      if (!wasOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        // Только при первом открытии не двигаем индекс
      } else {
        if (e.key === "ArrowDown") move(1);
        if (e.key === "ArrowUp") move(-1);
      }
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (!opened) return;
    // onBtnKey уже вызван — лишняя движ move, пропускаем
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      return; // уже обработано в onBtnKey
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        e.preventDefault();
        activeIdx = 0;
        apply();
        break;
      case "End":
        e.preventDefault();
        activeIdx = items.length - 1;
        apply();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (opened) choose(activeIdx);
        break;
      case "Escape":
        e.preventDefault();
        closeList();
        btn.focus();
        break;
      case "Tab":
        closeList();
        break;
      default:
        if (e.key.length === 1) {
          typeAheadBuf += e.key.toLowerCase();
          clearTimeout(typeAheadTimer);
          typeAheadTimer = setTimeout(() => (typeAheadBuf = ""), 400);
          const found = items.findIndex(
            (i) => !i.opt.disabled && i.opt.label.toLowerCase().startsWith(typeAheadBuf),
          );
          if (found >= 0) {
            activeIdx = found;
            apply();
          }
        }
    }
  };
  const onClick = (e: Event) => {
    const t = e.target as Element;
    if (t.closest(".ui-select__btn")) {
      if (opened) {
        closeList();
      } else {
        openList();
      }
      return;
    }
    const li = t.closest('[role="option"]');
    if (li && el.contains(li)) {
      const idx = items.findIndex((i) => i.li === li);
      choose(idx);
    } else if (!t.closest(".ui-select")) {
      closeList();
    }
  };
  btn.addEventListener("keydown", onBtnKey);
  el.addEventListener("keydown", onKey);
  document.addEventListener("click", onClick);

  return {
    el,
    getValue: () => value,
    setValue(v) {
      value = v;
      activeIdx = items.findIndex((i) => i.opt.value === v);
      apply();
    },
    open: openList,
    close: closeList,
    destroy() {
      btn.removeEventListener("keydown", onBtnKey);
      el.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    },
  };
}
