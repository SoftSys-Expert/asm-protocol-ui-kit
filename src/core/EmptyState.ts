import { h } from "./dom";

/**
 * EmptyState — headless-ядро пустого состояния.
 * A11y: роль не нужна, текст самодостаточен.
 */
export interface EmptyStateProps {
  /** Заголовок в терминальном духе: `no entries found`. */
  title: string;
  /** Что сделать пользователю. */
  hint?: string;
  /** CTA-кнопка. */
  actionLabel?: string;
  onAction?: () => void;
}

export interface EmptyStateApi {
  el: HTMLElement;
  destroy: () => void;
}

export function createEmptyState(props: EmptyStateProps): EmptyStateApi {
  const p = { ...props };
  const el = h("div", "ui-emptystate");
  const icon = h("div", "ui-emptystate__icon", { "aria-hidden": "true" });
  icon.textContent = "[ ]";
  const title = h("div", "ui-emptystate__title");
  title.textContent = p.title;
  el.append(icon, title);
  if (p.hint) {
    const hint = h("div", "ui-emptystate__hint");
    hint.textContent = p.hint;
    el.appendChild(hint);
  }
  let btn: HTMLButtonElement | null = null;
  if (p.actionLabel) {
    btn = h("button", "ui-emptystate__action");
    btn.type = "button";
    btn.textContent = p.actionLabel;
    el.appendChild(btn);
  }
  const onClick = () => p.onAction?.();
  btn?.addEventListener("click", onClick);
  return {
    el,
    destroy() {
      btn?.removeEventListener("click", onClick);
    },
  };
}
