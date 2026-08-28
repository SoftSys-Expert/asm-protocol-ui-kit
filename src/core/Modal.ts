import { h, uid, emit } from "./dom";

/**
 * Modal — headless-ядро модального окна.
 * A11y: role=dialog + aria-modal, focus-trap (Tab в пределах), ESC закрывает,
 * фокус возвращается на триггер, aria-labelledby по заголовку.
 */
export interface ModalProps {
  title?: string;
  /** Контент (DOM). */
  content?: HTMLElement | null;
  /** Подтверждающая кнопка (последняя). */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ModalApi {
  el: HTMLElement;
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
  destroy: () => void;
}

export function createModal(props: ModalProps): ModalApi {
  const p = { cancelLabel: "Cancel", ...props };
  const el = h("div", "ui-modal", { role: "dialog", "aria-modal": "true" });
  const titleId = uid("modal-title");
  const backdrop = h("div", "ui-modal__backdrop");
  const dialog = h("div", "ui-modal__dialog");
  const header = h("div", "ui-modal__header");
  const title = h("h2", "ui-modal__title", { id: titleId });
  title.textContent = p.title ?? "";
  const closeBtn = h("button", "ui-modal__close", { "aria-label": "Close dialog" });
  closeBtn.type = "button";
  closeBtn.textContent = "×";
  header.append(title, closeBtn);
  const body = h("div", "ui-modal__body");
  if (p.content) body.appendChild(p.content);
  dialog.append(header, body);
  if (p.confirmLabel || p.cancelLabel) {
    const footer = h("div", "ui-modal__footer");
    if (p.cancelLabel) {
      const cancel = h("button", "ui-modal__btn ui-modal__btn--cancel");
      cancel.type = "button";
      cancel.textContent = p.cancelLabel;
      cancel.addEventListener("click", () => closeModal());
      footer.appendChild(cancel);
    }
    if (p.confirmLabel) {
      const confirm = h("button", "ui-modal__btn ui-modal__btn--confirm");
      confirm.type = "button";
      confirm.textContent = p.confirmLabel;
      confirm.addEventListener("click", () => {
        p.onConfirm?.();
        emit(el, "ui:confirm", {});
        closeModal();
      });
      footer.appendChild(confirm);
    }
    dialog.appendChild(footer);
  }
  el.setAttribute("aria-labelledby", titleId);
  el.append(backdrop, dialog);

  let savedFocus: HTMLElement | null = null;
  let open = false;

  function focusables(): HTMLElement[] {
    return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (n) => !n.hasAttribute("disabled") && n.offsetParent !== null,
    );
  }

  const FOCUSABLE =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function trap(e: KeyboardEvent) {
    if (e.key !== "Tab") return;
    const list = focusables();
    if (list.length === 0) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const onDocKey = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    trap(e);
  };
  document.addEventListener("keydown", onDocKey, true);
  backdrop.addEventListener("click", () => closeModal());
  closeBtn.addEventListener("click", () => closeModal());

  function openModal() {
    if (open) return;
    open = true;
    savedFocus = document.activeElement as HTMLElement | null;
    el.removeAttribute("hidden");
    const list = focusables();
    (list[0] ?? dialog).focus();
    emit(el, "ui:open", {});
  }
  function closeModal() {
    if (!open) return;
    open = false;
    el.setAttribute("hidden", "");
    savedFocus?.focus?.();
    savedFocus = null;
    p.onCancel?.();
    emit(el, "ui:close", {});
  }
  el.setAttribute("hidden", "");

  return {
    el,
    open: openModal,
    close: closeModal,
    isOpen: () => open,
    destroy() {
      document.removeEventListener("keydown", onDocKey, true);
    },
  };
}
