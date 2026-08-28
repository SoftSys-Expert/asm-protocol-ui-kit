import { h, emit } from "./dom";

/**
 * Kbd — headless-ядро клавиши (горячие клавиши).
 */
export interface KbdApi {
  el: HTMLElement;
}

export function createKbd(key: string): KbdApi {
  const el = h("kbd", "ui-kbd");
  el.textContent = key;
  return { el };
}

/**
 * ModeSwitch — headless-ядро переключателя режимов контента.
 * Реализация: сегмент-контрол на нативных радио.
 * A11y: radiogroup + aria-label, текущий режим виден всегда.
 */
export interface ModeOption {
  id: string;
  label: string;
  /** Символ/иконка. */
  icon?: string;
}

export interface ModeSwitchProps {
  modes: ModeOption[];
  active?: string;
  label?: string;
  onChange?: (id: string) => void;
}

export interface ModeSwitchApi {
  el: HTMLElement;
  getActive: () => string;
  setActive: (id: string) => void;
  destroy: () => void;
}

export function createModeSwitch(props: ModeSwitchProps): ModeSwitchApi {
  const p = { ...props };
  const el = h("div", "ui-modeswitch", { role: "radiogroup" });
  if (p.label) el.setAttribute("aria-label", p.label);
  const buttons: { btn: HTMLButtonElement; mode: ModeOption }[] = [];
  for (const mode of p.modes) {
    const btn = h("button", "ui-modeswitch__btn", { role: "radio" });
    btn.type = "button";
    btn.setAttribute("aria-checked", String(mode.id === p.active));
    btn.dataset.id = mode.id;
    if (mode.icon) {
      const ic = h("span", "ui-modeswitch__icon", { "aria-hidden": "true" });
      ic.textContent = mode.icon;
      btn.appendChild(ic);
    }
    const lbl = h("span", "ui-modeswitch__label");
    lbl.textContent = mode.label;
    btn.appendChild(lbl);
    buttons.push({ btn, mode });
    el.appendChild(btn);
  }

  let active = p.active ?? p.modes[0]?.id ?? "";

  function apply() {
    for (const b of buttons) {
      const on = b.mode.id === active;
      b.btn.setAttribute("aria-checked", String(on));
      b.btn.classList.toggle("ui-modeswitch__btn--active", on);
      b.btn.tabIndex = on ? 0 : -1;
    }
  }
  apply();

  function setActive(id: string) {
    if (id === active) return;
    active = id;
    apply();
    p.onChange?.(id);
    emit(el, "ui:change", { id });
  }

  const onClick = (e: Event) => {
    const btn = (e.target as Element).closest(".ui-modeswitch__btn") as HTMLElement | null;
    if (btn) setActive(btn.dataset.id ?? "");
  };
  const onKey = (e: KeyboardEvent) => {
    const btn = (e.target as Element).closest(".ui-modeswitch__btn") as HTMLElement | null;
    if (!btn) return;
    const idx = buttons.findIndex((b) => b.btn === btn);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % buttons.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + buttons.length) % buttons.length;
    if (next >= 0) {
      e.preventDefault();
      setActive(buttons[next].mode.id);
      buttons[next].btn.focus();
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  return {
    el,
    getActive: () => active,
    setActive,
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}

/**
 * SkinSwitch — headless-ядро переключателя скина (operator/tty).
 * Смена: data-skin на корневом элементе (по умолчанию document.documentElement).
 */
export type SkinId = "operator" | "tty";

export interface SkinSwitchProps {
  skins?: SkinId[];
  active?: SkinId;
  /** Куда ставить атрибут data-skin. */
  target?: HTMLElement;
  onChange?: (skin: SkinId) => void;
}

export interface SkinSwitchApi {
  el: HTMLElement;
  getSkin: () => SkinId;
  setSkin: (skin: SkinId) => void;
  destroy: () => void;
}

const SKIN_LABELS: Record<SkinId, string> = {
  operator: "Operator",
  tty: "TTY",
};

export function createSkinSwitch(props: SkinSwitchProps): SkinSwitchApi {
  const p = { skins: ["operator", "tty"] as SkinId[], active: "operator" as SkinId, ...props };
  const target = p.target ?? document.documentElement;
  const inner = createModeSwitch({
    modes: p.skins.map((s) => ({ id: s, label: SKIN_LABELS[s] ?? s })),
    active: p.active,
    label: "Skin",
    onChange: (id) => {
      const skin = id as SkinId;
      target.setAttribute("data-skin", skin);
      p.onChange?.(skin);
    },
  });
  target.setAttribute("data-skin", p.active);
  return {
    el: inner.el,
    getSkin: () => inner.getActive() as SkinId,
    setSkin(skin) {
      inner.setActive(skin);
      target.setAttribute("data-skin", skin);
    },
    destroy: inner.destroy,
  };
}
