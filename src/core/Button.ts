import { h } from "./dom";

/**
 * Button — headless-ядро кнопки.
 * Поведение: variant, disabled, loading, события onClick / ui:click.
 * A11y: нативный <button>, aria-disabled при loading.
 * Визуал: НОЛЬ — скины красят .ui-btn по data-skin.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  /** Иконка/символ перед лейблом (текст, не DOM). */
  icon?: string;
  onClick?: (e: MouseEvent) => void;
}

export interface ButtonApi {
  el: HTMLButtonElement;
  /** Сменить вариант/размер/лейбл. */
  setProps: (patch: Partial<Omit<ButtonProps, "onClick">>) => void;
  /** Текущее состояние disabled (включая loading). */
  isDisabled: () => boolean;
  /** Вкл/выкл loading-режим. */
  setLoading: (v: boolean) => void;
  /** Уничтожить (снять листенеры). */
  destroy: () => void;
}

export function createButton(props: ButtonProps): ButtonApi {
  const p = {
    variant: "primary" as ButtonVariant,
    size: "md" as ButtonSize,
    disabled: false,
    loading: false,
    ...props,
  };

  const el = h("button", "ui-btn");
  el.type = "button";
  const iconEl = p.icon ? h("span", "ui-btn__icon", { "aria-hidden": "true" }) : null;
  const labelEl = h("span", "ui-btn__label");
  labelEl.textContent = p.label;
  if (iconEl) {
    iconEl.textContent = p.icon ?? "";
    el.appendChild(iconEl);
  }
  el.appendChild(labelEl);

  const click = (e: MouseEvent) => {
    if (p.disabled || p.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    props.onClick?.(e);
  };
  el.addEventListener("click", click);

  function apply() {
    el.classList.toggle("ui-btn--disabled", p.disabled);
    el.classList.toggle("ui-btn--loading", p.loading);
    el.dataset.variant = p.variant;
    el.dataset.size = p.size;
    if (p.disabled || p.loading) el.setAttribute("disabled", "");
    else el.removeAttribute("disabled");
    if (p.loading) el.setAttribute("aria-busy", "true");
    else el.removeAttribute("aria-busy");
    labelEl.textContent = p.label;
  }
  apply();

  return {
    el,
    setProps(patch) {
      Object.assign(p, patch);
      apply();
    },
    isDisabled: () => p.disabled || p.loading,
    setLoading(v) {
      p.loading = v;
      apply();
    },
    destroy() {
      el.removeEventListener("click", click);
    },
  };
}
